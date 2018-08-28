const Command = require('../../structures/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const querystring = require('querystring');
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
		let href;
		const nsfw = msg.channel.nsfw || false;
		try {
			href = await this.searchGoogle(query, nsfw);
		} catch (err) {
			try {
				href = await this.customSearch(query, nsfw);
			} catch (err2) {
				href = `http://lmgtfy.com/?iie=1&q=${encodeURIComponent(query)}`;
			}
		}
		if (!href) return msg.say('Could not find any results.');
		return msg.say(href);
	}

	async searchGoogle(query, nsfw) {
		const { text } = await request
			.get('https://www.google.com/search')
			.query({
				safe: nsfw ? 'off' : 'on',
				q: query
			});
		const $ = cheerio.load(text);
		let href = $('.r').first().find('a').first().attr('href');
		if (!href) return null;
		href = querystring.parse(href.replace('/url?', ''));
		return href.q;
	}

	async customSearch(query, nsfw) {
		const { body } = await request
			.get('https://www.googleapis.com/customsearch/v1')
			.query({
				key: GOOGLE_KEY,
				cx: CUSTOM_SEARCH_ID,
				safe: nsfw ? 'off' : 'active',
				q: query
			});
		if (!body.items) return null;
		return body.items[0].formattedUrl;
	}
};
