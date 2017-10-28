const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { parseString } = require('xml2js');
const { promisify } = require('util');
const xml = promisify(parseString);
const { shorten, cleanXML } = require('../../util/Util');
const { MAL_LOGIN } = process.env;

module.exports = class MyAnimeListMangaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'my-anime-list-manga',
			aliases: ['mal-manga', 'manga'],
			group: 'search',
			memberName: 'my-anime-list-manga',
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

	async run(msg, { query }) {
		try {
			const { text } = await snekfetch
				.get(`https://${MAL_LOGIN}@myanimelist.net/api/manga/search.xml`)
				.query({ q: query });
			const body = await xml(text);
			const data = body.manga.entry[0];
			const embed = new MessageEmbed()
				.setColor(0x2D54A2)
				.setAuthor('My Anime List', 'https://i.imgur.com/5rivpMM.png')
				.setURL(`https://myanimelist.net/manga/${data.id[0]}`)
				.setThumbnail(data.image[0])
				.setTitle(data.title[0])
				.setDescription(shorten(cleanXML(data.synopsis[0])))
				.addField('❯ Type',
					`${data.type[0]} - ${data.status[0]}`, true)
				.addField('❯ Volumes / Chapters',
					`${parseInt(data.volumes[0], 10) || '???'} / ${parseInt(data.chapters[0], 10) || '???'}`, true)
				.addField('❯ Start Date',
					data.start_date[0] !== '0000-00-00' ? data.start_date[0] : '???', true)
				.addField('❯ End Date',
					data.end_date[0] !== '0000-00-00' ? data.end_date[0] : '???', true);
			return msg.embed(embed);
		} catch (err) {
			if (err.message === 'Parse Error') return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
