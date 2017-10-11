const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { xml2js } = require('xml-js');
const { stripIndents } = require('common-tags');

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
			const parsed = xml2js(text, { compact: true }).posts;
			if (!parsed.post.length) return msg.say('Could not find any results.');
			return msg.say(stripIndents`
				Result for ${query}:
				http:${parsed.post[Math.floor(Math.random() * parsed.post.length)]._attributes.file_url}
			`);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
