const Command = require('../../framework/Command');
const google = require('googlethis');
const { stripIndents } = require('common-tags');

module.exports = class GoogleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'google',
			aliases: ['google-this', 'search'],
			group: 'search',
			description: 'Searches Google.',
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Search Results'
				}
			],
			args: [
				{
					key: 'query',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		const { results } = await google.search(query, {
			page: 0,
			safe: !msg.channel.nsfw,
			parse_ads: false,
			additional_params: {
				hl: 'en'
			}
		});
		if (!results.length) return msg.reply('Could not find any results.');
		const result = results[0];
		return msg.reply(stripIndents`
			**${result.title}**
			${result.description}
			<${result.url}>
		`);
	}
};
