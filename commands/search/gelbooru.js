const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { parseString } = require('xml2js');
const { promisify } = require('util');
const xml = promisify(parseString);

module.exports = class GelbooruCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gelbooru',
			aliases: ['gelbooru-image'],
			group: 'search',
			memberName: 'gelbooru',
			description: 'Searches Gelbooru for your query.',
			args: [
				{
					key: 'query',
					prompt: 'What image would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		if (!msg.channel.nsfw) return msg.reply('This command can only be used in NSFW channels.');
		try {
			const { text } = await snekfetch
				.get('https://gelbooru.com/index.php')
				.query({
					page: 'dapi',
					s: 'post',
					q: 'index',
					tags: query
				});
			const body = await xml(text);
			const data = body.posts.post;
			if (!data || !data.length) return msg.say('Could not find any results.');
			return msg.say(data[Math.floor(Math.random() * data.length)].$.file_url);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
