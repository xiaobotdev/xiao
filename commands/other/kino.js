const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { escapeMarkdown } = require('discord.js');
const { verify } = require('../../util/Util');
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
				},
				{
					key: 'page',
					prompt: 'What page do you want to start from?',
					type: 'integer',
					min: 1,
					default: 1
				}
			]
		});
	}

	async run(msg, { story, page }) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			const storyData = await this.generateStory(story);
			let i = page - 1;
			let end = false;
			while (!end) {
				const line = storyData[i];
				if (!line) {
					end = true;
					break;
				}
				await msg.say(stripIndents`
					**Page ${i + 1}/${storyData.length}**

					${escapeMarkdown(line.trim())}

					_Proceed?_
				`);
				const verification = await verify(msg.channel, msg.author, { time: 300000 });
				if (!verification) {
					this.client.games.delete(msg.channel.id);
					const filename = stories.find(sto => sto.toLowerCase() === story);
					const num = stories.indexOf(filename).toString().padStart(2, '0');
					const usage = this.usage(`${num} ${i + 1}`);
					return msg.say(`You can resume reading from where you were by using ${usage}.`);
				}
				i++;
			}
			this.client.games.delete(msg.channel.id);
			return msg.say('Thank you for reading this chapter of Kino\'s Journey!');
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
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
