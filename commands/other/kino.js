const Command = require('../../framework/Command');
const { MessageActionRow, MessageButton } = require('discord.js');
const { stripIndents } = require('common-tags');
const { escapeMarkdown } = require('discord.js');
const path = require('path');
const fs = require('fs');
const { readFile } = require('fs/promises');
const stories = fs.readdirSync(path.join(__dirname, '..', '..', 'assets', 'txt', 'kino'))
	.map(story => story.slice(3).replace('.txt', ''));

module.exports = class KinoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kino',
			aliases: ['kino-journey', 'kinos-journey', 'kino\'s-journey'],
			group: 'other',
			memberName: 'kino',
			description: 'Read various Kino\'s Journey fan stories by dragonfire535.',
			details: stripIndents`
				**Stories:**
				\`\`\`
				${stories.map((story, i) => `${i.toString().padStart(2, '0')}. ${story}`).join('\n')}
				\`\`\`
			`,
			credit: [
				{
					name: 'Kino\'s Journey',
					url: 'https://kinonotabi.com/',
					reason: 'Original Concept'
				}
			],
			args: [
				{
					key: 'story',
					prompt: stripIndents`
						What story do you want to read? You can type the number or the name.
						\`\`\`
						${stories.map((story, i) => `${i.toString().padStart(2, '0')}. ${story}`).join('\n')}
						\`\`\`
					`,
					type: 'string',
					validate: choice => {
						if (stories.some(story => choice.toLowerCase() === story.toLowerCase())) return true;
						const num = Number.parseInt(choice, 10);
						return Boolean(stories[num]);
					},
					parse: choice => {
						if (stories.some(story => choice.toLowerCase() === story.toLowerCase())) {
							return choice.toLowerCase();
						}
						const num = Number.parseInt(choice, 10);
						return stories[num].toLowerCase();
					}
				}
			]
		});
	}

	async run(msg, { story }) {
		const storyData = await this.generateStory(story);
		let i = 0;
		let end = false;
		const row = new MessageActionRow();
		row.addComponents(
			new MessageButton().setCustomId('prev').setLabel('Prev').setStyle('PRIMARY').setDisabled(true),
			new MessageButton().setCustomId('next').setLabel('Next').setStyle('PRIMARY'),
			new MessageButton().setCustomId('end').setLabel('End').setStyle('DANGER')
		);
		const initialMsg = await msg.say(stripIndents`
			Welcome to Kino's Journey!
			Press the "Next" button to go to the next page, and "Prev" to go back.
			Press "End" at any time to stop reading.
		`, { components: [row] });
		const filter = res => res.user.id === msg.author.id;
		const initialInteractions = await initialMsg.awaitMessageComponentInteractions(filter, {
			max: 1,
			time: 15000
		});
		if (!initialInteractions.size) return initialMsg.edit('Maybe next time!', { components: [] });
		let choice = initialInteractions.first();
		if (choice.customId === 'end') return choice.update('Maybe next time!', { components: [] });
		while (!end) {
			if (i === 0) {
				row.components[0].setDisabled(true);
			} else {
				row.components[0].setDisabled(false);
			}
			const line = storyData[i];
			if (!line) {
				end = true;
				break;
			}
			await choice.update(stripIndents`
				**Page ${i + 1}/${storyData.length}**

				${escapeMarkdown(line.trim())}
			`, { components: [row] });
			const interactions = await initialMsg.awaitMessageComponentInteractions(filter, {
				max: 1,
				time: 120000
			});
			if (!interactions.size) break;
			choice = interactions.first();
			if (choice.customId === 'next') {
				i++;
			} else if (choice.customId === 'prev') {
				i--;
			} else if (choice.customId === 'end') {
				break;
			} else {
				return initialMsg.edit('Maybe next time!', { components: [] });
			}
		}
		return choice.update('Thank you for reading this chapter of Kino\'s Journey!', { components: [] });
	}

	async generateStory(file) {
		const filename = stories.find(story => story.toLowerCase() === file);
		const num = stories.indexOf(filename).toString().padStart(2, '0');
		const story = await readFile(path.join(__dirname, '..', '..', 'assets', 'txt', 'kino', `${num} ${filename}.txt`), {
			encoding: 'utf8'
		});
		const chunks = [];
		let currentChunk = '';
		for (const paragraph of story.split('\n\n')) {
			if (paragraph === '***' && currentChunk) {
				chunks.push(currentChunk);
				currentChunk = '***\n\n';
				continue;
			}
			currentChunk += paragraph;
			currentChunk += '\n\n';
			if (currentChunk.length > 1000) {
				chunks.push(currentChunk);
				currentChunk = '';
			}
		}
		chunks.push(currentChunk);
		return chunks;
	}
};
