const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { parseString } = require('xml2js');
const { promisify } = require('util');
const xml = promisify(parseString);

module.exports = class SafebooruCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'safebooru',
			aliases: ['safebooru-image'],
			group: 'search',
			memberName: 'safebooru',
			description: 'Searches Safebooru for your query.',
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
		try {
			const { text } = await snekfetch
				.get('https://safebooru.org/index.php')
				.query({
					page: 'dapi',
					s: 'post',
					q: 'index',
					tags: query
				});
			const body = await xml(text);
			const data = body.posts.post;
			if (!data || !data.length) return msg.say('Could not find any results.');
			return msg.say(`https:${data[Math.floor(Math.random() * data.length)].$.file_url}`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
