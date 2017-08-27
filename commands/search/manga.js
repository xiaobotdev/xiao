const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { cleanXML, shorten } = require('../../structures/Util');
const { promisify } = require('util');
const xml = promisify(require('xml2js').parseString);
const { ANIMELIST_LOGIN } = process.env;

module.exports = class MangaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'manga',
			group: 'search',
			memberName: 'manga',
			description: 'Searches My Anime List for your query, getting manga results.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What manga would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { query } = args;
		try {
			const { text } = await snekfetch
				.get(`https://${ANIMELIST_LOGIN}@myanimelist.net/api/manga/search.xml`)
				.query({ q: query });
			const { manga } = await xml(text);
			const synopsis = cleanXML(manga.entry[0].synopsis[0]);
			const embed = new MessageEmbed()
				.setColor(0x2D54A2)
				.setAuthor('My Anime List', 'https://i.imgur.com/R4bmNFz.png')
				.setURL(`https://myanimelist.net/manga/${manga.entry[0].id[0]}`)
				.setThumbnail(manga.entry[0].image[0])
				.setTitle(`${manga.entry[0].title[0]} (English: ${manga.entry[0].english[0] || 'N/A'})`)
				.setDescription(shorten(synopsis))
				.addField('❯ Type',
					`${manga.entry[0].type[0]} - ${manga.entry[0].status[0]}`, true)
				.addField('❯ Volumes / Chapters',
					`${manga.entry[0].volumes[0]} / ${manga.entry[0].chapters[0]}`, true)
				.addField('❯ Start Date',
					manga.entry[0].start_date[0], true)
				.addField('❯ End Date',
					manga.entry[0].end_date[0], true);
			return msg.embed(embed);
		} catch (err) {
			if (err.message === 'Parse Error') return msg.say('Could not find any results.');
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
