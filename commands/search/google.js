const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { GOOGLE_KEY, CUSTOM_SEARCH_ID } = process.env;

module.exports = class GoogleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'google',
			aliases: ['google-search', 'search-google'],
			group: 'search',
			memberName: 'google',
			description: 'Searches Google for your query.',
			args: [
				{
					key: 'query',
					prompt: 'What would you like to search for?',
					type: 'string',
					validate: query => {
						if (encodeURIComponent(query).length < 1950) return true;
						return 'Invalid query, your query is too long.';
					}
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('https://www.googleapis.com/customsearch/v1')
				.query({
					key: GOOGLE_KEY,
					cx: CUSTOM_SEARCH_ID,
					q: query
				});
			if (!body.items) return msg.say('Could not find any results.');
			return msg.say(body.items[0].formattedUrl);
		} catch (err) {
			return msg.say(`http://lmgtfy.com/?iie=1&q=${encodeURIComponent(query)}`);
		}
	}
};
