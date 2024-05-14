const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { stripIndents } = require('common-tags');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { decode: decodeHTML } = require('html-entities');
const { firstUpperCase, embedURL } = require('../../util/Util');
const { months } = require('../../assets/json/month');

module.exports = class FloridaManCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'florida-man',
			aliases: ['florida'],
			group: 'events',
			memberName: 'florida-man',
			description: 'Responds with the Flordia man of the day.',
			clientPermissions: [PermissionFlagsBits.EmbedLinks],
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
					default: new Date().getMonth() + 1
				},
				{
					key: 'day',
					type: 'integer',
					default: new Date().getDate(),
					min: 1,
					max: 31
				}
			]
		});

		this.cache = new Map();
	}

	async run(msg, { month, day }) {
		const article = await this.fetchArticle(month, day);
		if (!article) return msg.say('Could not find any results.');
		return msg.say(stripIndents`
			**${article.title}**
			${firstUpperCase(months[month - 1])} ${day} — ${article.firstLine}
			${embedURL('Read more...', `<https://floridamanbirthday.org/${months[month - 1]}-${day}>`)}
		`, { files: [article.image] });
	}

	async fetchArticle(month, day) {
		if (this.cache.has(`${month}-${day}`)) return this.cache.get(`${month}-${day}`);
		try {
			const { text } = await request.get(`https://floridamanbirthday.org/${months[month - 1]}-${day}`);
			const $ = cheerio.load(text);
			const result = {
				title: decodeHTML($('p').first().text().replace(/\n/g, ' ')),
				firstLine: decodeHTML($('p').eq(1).text().replace(/\n/g, ' ')),
				image: `https:${$('img').eq(1).attr('data-lazy-src')}`
			};
			this.cache.set(`${month}-${day}`, result);
			return result;
		} catch (err) {
			if (err.status === 404) return null;
			throw err;
		}
	}
};
