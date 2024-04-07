const Command = require('../../framework/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { shorten } = require('../../util/Util');
const logos = require('../../assets/json/logos');

module.exports = class KnowYourMemeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'know-your-meme',
			aliases: ['kym', 'meme-info', 'meme-search'],
			group: 'search',
			memberName: 'know-your-meme',
			description: 'Searches Know Your Meme for your query.',
			clientPermissions: [PermissionFlagsBits.EmbedLinks],
			credit: [
				{
					name: 'Know Your Meme',
					url: 'https://knowyourmeme.com/',
					reason: 'Meme Data'
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
		const location = await this.search(query);
		if (!location) return msg.say('Could not find any results.');
		const data = await this.fetchMeme(location);
		const embed = new EmbedBuilder()
			.setColor(0x12133F)
			.setAuthor({ name: 'Know Your Meme', iconURL: logos.kym, url: 'https://knowyourmeme.com/' })
			.setTitle(data.name)
			.setDescription(shorten(data.description || 'No description available.'))
			.setURL(data.url)
			.setThumbnail(data.thumbnail);
		return msg.embed(embed);
	}

	async search(query) {
		const { text } = await request
			.get('https://knowyourmeme.com/search')
			.query({ q: query });
		const $ = cheerio.load(text);
		const location = $('.entry-grid-body').find('tr td a').first().attr('href');
		if (!location) return null;
		return location;
	}

	async fetchMeme(location) {
		const { text } = await request.get(`https://knowyourmeme.com${location}`);
		const $ = cheerio.load(text);
		const thumbnail = $('a[class="photo left wide"]').first().attr('href')
			|| $('a[class="photo left "]').first().attr('href')
			|| null;
		return {
			name: $('h1').first().text().trim(),
			url: `https://knowyourmeme.com${location}`,
			description: this.getMemeDescription($),
			thumbnail
		};
	}

	getMemeDescription($) {
		const children = $('.bodycopy').first().children();
		let foundAbout = false;
		for (let i = 0; i < children.length; i++) {
			const text = children.eq(i).text();
			if (foundAbout) {
				if (text) return text;
			} else if (text === 'About') {
				foundAbout = true;
			}
		}
		return null;
	}
};
