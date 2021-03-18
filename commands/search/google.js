const Command = require('../../structures/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const UserAgent = require('user-agents');
const { URLSearchParams, URL } = require('url');

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
		let hrefs;
		try {
			hrefs = await this.search(query, msg.channel.nsfw || false);
		} catch {
			hrefs = [{ href: `http://lmgtfy.com/?iie=1&q=${encodeURIComponent(query)}`, title: 'LMGTFY' }];
		}
		if (!hrefs) return msg.say('Could not find any results.');
		return msg.say(hrefs.map(href => `${href.title}\n<${href.href}>`).join('\n\n'));
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
			.set({ 'User-Agent': new UserAgent({ deviceCategory: 'desktop' }).toString() });
		const $ = cheerio.load(text);
		const links = [];
		$('body').find('h3').each((i, h3) => {
			if ($(h3).parent()) {
				const href = $(h3).parent().attr('href');
				if (href) {
					const params = new URLSearchParams(href);
					const url = new URL(params.get('url'));
					if (nsfw || !this.client.adultSiteList.includes(url.host)) {
						links.push({ href: url.href, title: $(h3).text() });
					}
				}
			}
		});
		if (!links.length) return null;
		return links.slice(0, 3);
	}
};
