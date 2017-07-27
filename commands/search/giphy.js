const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const { giphyKey } = require('../../config');

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
					prompt: 'What would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { query } = args;
		const { body } = await snekfetch
			.get('http://api.giphy.com/v1/gifs/search')
			.query({
				q: query,
				api_key: giphyKey,
				rating: msg.channel.nsfw ? 'r' : 'pg'
			});
		if (!body.data.length) return msg.say('No Results.');
		const random = Math.floor(Math.random() * body.data.length);
		return msg.say(body.data[random].images.original.url);
	}
};
