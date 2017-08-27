const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const { GIPHY_KEY } = process.env;

module.exports = class GiphyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'giphy',
			group: 'search',
			memberName: 'giphy',
			description: 'Searches Giphy for your query.',
			args: [
				{
					key: 'query',
					prompt: 'What GIF would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { query } = args;
		try {
			const { body } = await snekfetch
				.get('http://api.giphy.com/v1/gifs/search')
				.query({
					q: query,
					api_key: GIPHY_KEY,
					rating: msg.channel.nsfw ? 'r' : 'pg'
				});
			if (!body.data.length) return msg.say('Could not find any results.');
			return msg.say(body.data[Math.floor(Math.random() * body.data.length)].images.original.url);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
