const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { TENOR_KEY } = process.env;

module.exports = class TenorCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tenor',
			group: 'search',
			memberName: 'tenor',
			description: 'Searches Tenor for your query.',
			credit: [
				{
					name: 'Tenor',
					url: 'https://tenor.com/',
					reason: 'API',
					reasonURL: 'https://tenor.com/gifapi/documentation'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What GIF would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('https://api.tenor.com/v1/search')
				.query({
					q: query,
					key: TENOR_KEY,
					limit: 50,
					contentfilter: msg.channel.nsfw ? 'off' : 'high',
					media_filter: 'minimal'
				});
			if (!body.results.length) return msg.say('Could not find any results.');
			return msg.say(body.results[Math.floor(Math.random() * body.results.length)].media[0].gif.url);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
