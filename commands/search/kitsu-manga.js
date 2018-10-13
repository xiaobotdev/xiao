const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { oneLine } = require('common-tags');
const { shorten, formatNumber, firstUpperCase } = require('../../util/Util');

module.exports = class KitsuMangaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kitsu-manga',
			aliases: ['my-anime-list-manga', 'mal-manga', 'manga'],
			group: 'search',
			memberName: 'kitsu-manga',
			description: 'Searches Kitsu.io for your query, getting manga results.',
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
			const { text } = await request
				.get('https://kitsu.io/api/edge/manga')
				.query({ 'filter[text]': query });
			const body = JSON.parse(text);
			if (!body.data.length) return msg.say('Could not find any results.');
			const data = body.data[0].attributes;
			const embed = new MessageEmbed()
				.setColor(0xF75239)
				.setAuthor('Kitsu.io', 'https://i.imgur.com/lVqooyd.png', 'https://kitsu.io/explore/manga')
				.setURL(`https://kitsu.io/manga/${data.slug}`)
				.setThumbnail(data.posterImage ? data.posterImage.original : null)
				.setTitle(data.canonicalTitle)
				.setDescription(shorten(data.synopsis))
				.addField('❯ Type', `${firstUpperCase(data.subtype)} - ${firstUpperCase(data.status)}`, true)
				.addField('❯ Volumes / Chapters', oneLine`
					${data.volumeCount ? formatNumber(data.volumeCount) : '???'}
					/
					${data.chapterCount ? formatNumber(data.chapterCount) : '???'}
				`, true)
				.addField('❯ Start Date', data.startDate ? moment.utc(data.startDate).format('MM/DD/YYYY') : '???', true)
				.addField('❯ End Date', data.endDate ? moment.utc(data.endDate).format('MM/DD/YYYY') : '???', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
