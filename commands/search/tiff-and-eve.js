const Command = require('../../framework/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { decode: decodeHTML } = require('html-entities');
const { oneLine } = require('common-tags');
const types = ['random', 'today'];

module.exports = class TiffAndEveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tiff-and-eve',
			aliases: ['tiff-eve', 'tiff', 'tae'],
			group: 'search',
			description: 'Responds with a Tiff and Eve comic, either today\'s, a random one, or a specific one.',
			clientPermissions: [PermissionFlagsBits.EmbedLinks],
			credit: [
				{
					name: 'Fran Sundblad',
					url: 'https://www.fransundblad.com/',
					reason: 'Original Comic',
					reasonURL: 'https://www.fransundblad.com/tiff-and-eve/'
				}
			],
			flags: [
				{
					key: 'force',
					description: 'Forces an update to the comic count.'
				},
				{
					key: 'f',
					description: 'Alias for force.'
				}
			],
			args: [
				{
					key: 'query',
					type: 'string',
					default: 'today',
					validate: query => {
						if (types.includes(query.toLowerCase())) return true;
						const num = Number.parseInt(query, 10);
						if (!Number.isNaN(num) && num > 0) return true;
						return `Invalid query, please enter either today, random, or a specific comic number.`;
					},
					parse: query => query.toLowerCase()
				}
			]
		});

		this.current = null;
		this.cache = new Map();
	}

	async run(msg, { query, flags }) {
		const current = await this.fetchTotal(Boolean(flags.force || flags.f));
		if (query === 'today') {
			const { title, alt, image, date } = await this.fetchComic(current);
			const embed = new EmbedBuilder()
				.setTitle(`${date} - ${title}`)
				.setColor(0xA7D8F0)
				.setURL(`https://www.fransundblad.com/tiff-and-eve/${current}/`)
				.setImage(image)
				.setFooter({ text: alt });
			return msg.embed(embed);
		}
		if (query === 'random') {
			const random = Math.floor(Math.random() * (current + 1));
			const { title, alt, image, date } = await this.fetchComic(random);
			const embed = new EmbedBuilder()
				.setTitle(`${date} - ${title}`)
				.setColor(0xA7D8F0)
				.setURL(`https://www.fransundblad.com/tiff-and-eve/${random}/`)
				.setImage(image)
				.setFooter({ text: alt });
			return msg.embed(embed);
		}
		const choice = Number.parseInt(query, 10);
		if (current < choice) return msg.say('Could not find any results.');
		const { title, alt, image, date } = await this.fetchComic(choice);
		const embed = new EmbedBuilder()
			.setTitle(`${date} - ${title}`)
			.setColor(0xA7D8F0)
			.setURL(`https://www.fransundblad.com/tiff-and-eve/${choice}/`)
			.setImage(image)
			.setFooter({ text: alt });
		return msg.embed(embed);
	}

	async fetchTotal(force = false) {
		if (this.current && !force) return this.current;
		const { text } = await request.get('https://www.fransundblad.com/tiff-and-eve/');
		const $ = cheerio.load(text);
		this.current = Number.parseInt($('h6.colibri-word-wrap').first().text().trim().match(/(\d+)/)[1], 10);
		setTimeout(() => { this.current = null; }, 4.32e+7);
		return this.current;
	}

	async fetchComic(number) {
		if (this.cache.has(number)) return this.cache.get(number);
		const { text } = await request.get(`https://www.fransundblad.com/tiff-and-eve/${number}/`);
		const $ = cheerio.load(text);
		const data = {
			title: decodeHTML($('h1.colibri-word-wrap').first().text().trim()),
			image: $('img.attachment-full.size-full').first().attr('src'),
			alt: oneLine(decodeHTML($('div.colibri-post-excerpt').first().text().trim())),
			date: $('div.metadata-item').eq(1).text().trim()
		};
		this.cache.set(number, data);
		return data;
	}
};
