const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { xml2js } = require('xml-js');
const { shorten, cleanXML } = require('../../util/Util');
const { MAL_LOGIN } = process.env;

module.exports = class MyAnimeListAnimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'my-anime-list-anime',
			aliases: ['mal-anime', 'anime'],
			group: 'search',
			memberName: 'my-anime-list-anime',
			description: 'Searches My Anime List for your query, getting anime results.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What anime would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { text } = await snekfetch
				.get(`https://${MAL_LOGIN}@myanimelist.net/api/anime/search.xml`)
				.query({ q: query });
			const body = xml2js(text, { compact: true }).anime;
			const data = body.entry.length ? body.entry[0] : body.entry;
			const embed = new MessageEmbed()
				.setColor(0x2D54A2)
				.setAuthor('My Anime List', 'https://i.imgur.com/5rivpMM.png')
				.setURL(`https://myanimelist.net/anime/${data.id._text}`)
				.setThumbnail(data.image._text)
				.setTitle(data.title._text)
				.setDescription(shorten(cleanXML(data.synopsis._text)))
				.addField('❯ Type',
					`${data.type._text} - ${data.status._text}`, true)
				.addField('❯ Episodes',
					data.episodes._text, true)
				.addField('❯ Start Date',
					data.start_date._text !== '0000-00-00' ? data.start_date._text : '???', true)
				.addField('❯ End Date',
					data.end_date._text !== '0000-00-00' ? data.end_date._text : '???', true);
			return msg.embed(embed);
		} catch (err) {
			if (err.message === 'Parse Error') return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
