const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { xml2js } = require('xml-js');
const { stripIndents } = require('common-tags');

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
		if (!msg.channel.nsfw) return msg.say('This command can only be used in NSFW channels.');
		try {
			const { text } = await snekfetch
				.get('https://gelbooru.com/index.php')
				.query({
					page: 'dapi',
					s: 'post',
					q: 'index',
					tags: query
				});
			const parsed = xml2js(text, { compact: true }).posts;
			if (!parsed.post || !parsed.post.length) return msg.say('Could not find any results.');
			return msg.say(stripIndents`
				Result for ${query}:
				https:${parsed.post[Math.floor(Math.random() * parsed.post.length)]._attributes.file_url}
			`);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
