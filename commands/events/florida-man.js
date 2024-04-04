const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { decode: decodeHTML } = require('html-entities');
const { months } = require('../../assets/json/month');

module.exports = class FloridaManCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'florida-man',
			aliases: ['florida'],
			group: 'events',
			memberName: 'florida-man',
			description: 'Responds with the Flordia man of the day.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'floridamanbirthday.org',
					url: 'https://floridamanbirthday.org/',
					reason: 'News Data'
				}
			],
			args: [
				{
					key: 'month',
					type: 'month',
					default: ''
				},
				{
					key: 'day',
					type: 'integer',
					default: '',
					min: 1,
					max: 31
				}
			]
		});
	}

	async run(msg, { month, day }) {
		const today = new Date();
		const article = await this.fetchArticle(month || today.getMonth() + 1, day || today.getDate());
		if (!article) return msg.say('Could not find any results.');
		return msg.say(stripIndents`
			**${article.title}**
			${article.firstLine}
			[Read more...](https://floridamanbirthday.org/${months[month - 1]}-${day})
		`, { files: [article.image] });
	}

	async fetchArticle(month, day) {
		try {
			const { text } = await request.get(`https://floridamanbirthday.org/${months[month - 1]}-${day}`);
			const $ = cheerio.load(text);
			return {
				title: decodeHTML($('p').first().children().first().text()),
				firstLine: decodeHTML($('p').eq(1).children().first().text()),
				image: `https:${$('img').eq(2).attr('data-lazy-src')}`
			};
		} catch (err) {
			if (err.status === 404) return null;
			throw err;
		}
	}
};
