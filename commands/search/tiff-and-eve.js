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
			args: [
				{
					key: 'query',
					type: 'string',
					default: 'today',
					validate: query => {
						if (types.includes(query.toLowerCase())) return true;
						const num = Number.parseInt(query, 10);
						if (!Number.isNaN(num) && num > 1) return true;
						return `Invalid query, please enter either today, random, or a specific comic number.`;
					},
					parse: query => query.toLowerCase()
				}
			]
		});
	}

	async run(msg, { query }) {
		const { text: currentText } = await request.get('https://www.fransundblad.com/tiff-and-eve/');
		const $current = cheerio.load(currentText);
		const current = Number.parseInt($current('h6.colibri-word-wrap').first().text().trim().match(/(\d+)/)[1], 10);
		if (query === 'today') {
			const title = decodeHTML($current('h1.colibri-word-wrap').first().text().trim());
			const image = $current('img.attachment-full.size-full').first().attr('src');
			const alt = oneLine(decodeHTML($current('div.colibri-post-excerpt').first().text().trim()));
			const date = $current('div.metadata-item').eq(1).text().trim();
			const embed = new EmbedBuilder()
				.setTitle(`${date} - ${title}`)
				.setColor(0x9797FF)
				.setURL(`https://www.fransundblad.com/tiff-and-eve/${current}/`)
				.setImage(image)
				.setFooter({ text: alt });
			return msg.embed(embed);
		}
		if (query === 'random') {
			const random = Math.floor(Math.random() * (current + 1));
			const { text } = await request.get(`https://www.fransundblad.com/tiff-and-eve/${random}/`);
			const $ = cheerio.load(text);
			const title = decodeHTML($('h1.colibri-word-wrap').first().text().trim());
			const image = $('img.attachment-full.size-full').first().attr('src');
			const alt = oneLine(decodeHTML($('div.colibri-post-excerpt').first().text().trim()));
			const date = $('div.metadata-item').eq(1).text().trim();
			const embed = new EmbedBuilder()
				.setTitle(`${date} - ${title}`)
				.setColor(0x9797FF)
				.setURL(`https://www.fransundblad.com/tiff-and-eve/${random}/`)
				.setImage(image)
				.setFooter({ text: alt });
			return msg.embed(embed);
		}
		const choice = Number.parseInt(query, 10);
		if (current < choice) return msg.say('Could not find any results.');
		const { text } = await request.get(`https://www.fransundblad.com/tiff-and-eve/${choice}/`);
		const $ = cheerio.load(text);
		const title = decodeHTML($('h1.colibri-word-wrap').first().text().trim());
		const image = $('img.attachment-full.size-full').first().attr('src');
		const alt = oneLine(decodeHTML($('div.colibri-post-excerpt').first().text().trim()));
		const date = $('div.metadata-item').eq(1).text().trim();
		const embed = new EmbedBuilder()
			.setTitle(`${date} - ${title}`)
			.setColor(0x9797FF)
			.setURL(`https://www.fransundblad.com/tiff-and-eve/${choice}/`)
			.setImage(image)
			.setFooter({ text: alt });
		return msg.embed(embed);
	}
};
