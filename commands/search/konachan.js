const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');

module.exports = class KonachanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'konachan',
			aliases: ['konachan-image'],
			group: 'search',
			memberName: 'konachan',
			description: 'Searches Konachan for your query.',
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
		if (!msg.channel.nsfw) return msg.say('This command can only be used in NSFW channels.');
		try {
			const { body } = await snekfetch
				.get('https://konachan.net/post.json')
				.query({
					tags: `${query} order:random`,
					limit: 1
				});
			if (!body.length || !body[0].file_url) return msg.say('Could not find any results.');
			return msg.say(stripIndents`
				Result for ${query}:
				https:${body[0].file_url}
			`);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
