const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { escapeMarkdown } = require('discord.js');
const { verify, list } = require('../../util/Util');
const path = require('path');
const fs = require('fs');
const { readFile } = require('fs/promises');
const stories = fs.readdirSync(path.join(__dirname, '..', '..', 'assets', 'txt', 'kino'))
	.map(story => story.replace('.txt', ''));

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
					prompt: `What story do you want to read? Either ${list(stories, 'or')}.`,
					type: 'string',
					oneOf: stories.map(story => story.toLowerCase()),
					parse: story => story.toLowerCase()
				}
			]
		});
	}

	async run(msg, { story }) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		const storyData = await this.generateStory(story);
		try {
			let i = 0;
			let end = false;
			while (!end) {
				const line = storyData[i];
				if (!line) {
					end = true;
					break;
				}
				await msg.say(stripIndents`
					${escapeMarkdown(line)}

					_Proceed?_
				`);
				const verification = await verify(msg.channel, msg.author, { time: 120000 });
				if (!verification) {
					end = true;
					break;
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
		const story = await readFile(path.join(__dirname, '..', '..', 'assets', 'txt', 'kino', `${filename}.txt`), {
			encoding: 'utf8'
		});
		const chunks = [];
		let currentChunk = '';
		for (const paragraph of story.split('\n\n')) {
			if (paragraph === '***') {
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
		return chunks;
	}
};
