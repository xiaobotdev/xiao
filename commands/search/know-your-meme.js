const Command = require('../../framework/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { MessageEmbed } = require('discord.js');
const { shorten } = require('../../util/Util');

module.exports = class KnowYourMemeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'know-your-meme',
			aliases: ['kym', 'meme-info', 'meme-search'],
			group: 'search',
			memberName: 'know-your-meme',
			description: 'Searches Know Your Meme for your query.',
			clientPermissions: ['EMBED_LINKS'],
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
					prompt: 'What meme would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const location = await this.search(query);
			if (!location) return msg.say('Could not find any results.');
			const data = await this.fetchMeme(location);
			const embed = new MessageEmbed()
				.setColor(0x12133F)
				.setAuthor('Know Your Meme', 'https://i.imgur.com/WvcH4Z2.png', 'https://knowyourmeme.com/')
				.setTitle(data.name)
				.setDescription(shorten(data.description || 'No description available.'))
				.setURL(data.url)
				.setThumbnail(data.thumbnail);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
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
