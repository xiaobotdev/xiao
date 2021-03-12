const Command = require('../../structures/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { URLSearchParams } = require('url');

module.exports = class GoogleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'google',
			aliases: ['search'],
			group: 'search',
			memberName: 'google',
			description: 'Searches Google for your query.',
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Search'
				},
				{
					name: 'LMGTFY',
					url: 'https://lmgtfy.com/',
					reason: 'API'
				}
			],
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
		try {
			href = await this.search(query, msg.channel.nsfw || false);
		} catch {
			href = `http://lmgtfy.com/?iie=1&q=${encodeURIComponent(query)}`;
		}
		if (!href) return msg.say('Could not find any results.');
		return msg.say(href);
	}

	async search(query, nsfw) {
		const { text } = await request
			.get('https://www.google.com/search')
			.query({
				safe: nsfw ? 'images' : 'active',
				pws: 0,
				filter: 0,
				q: query
			})
			.set({ 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1' });
		const $ = cheerio.load(text);
		const links = [];
		$('body').find('h3').each((i, h3) => {
			if ($(h3).parent()) {
				const href = $(h3).parent().attr('href');
				if (href) {
					const params = new URLSearchParams(href);
					links.push(params.url);
				}
			}
		});
		return links[0];
	}
};
