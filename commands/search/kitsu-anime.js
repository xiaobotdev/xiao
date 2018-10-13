const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten, formatNumber, firstUpperCase } = require('../../util/Util');

module.exports = class KitsuAnimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kitsu-anime',
			aliases: ['my-anime-list-anime', 'mal-anime', 'anime'],
			group: 'search',
			memberName: 'kitsu-anime',
			description: 'Searches Kitsu.io for your query, getting anime results.',
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
			const { text } = await request
				.get('https://kitsu.io/api/edge/anime')
				.query({ 'filter[text]': query });
			const body = JSON.parse(text);
			if (!body.data.length) return msg.say('Could not find any results.');
			const data = body.data[0].attributes;
			const embed = new MessageEmbed()
				.setColor(0xF75239)
				.setAuthor('Kitsu.io', 'https://i.imgur.com/lVqooyd.png', 'https://kitsu.io/explore/anime')
				.setURL(`https://kitsu.io/anime/${data.slug}`)
				.setThumbnail(data.posterImage ? data.posterImage.original : null)
				.setTitle(data.canonicalTitle)
				.setDescription(shorten(data.synopsis))
				.addField('❯ Type', `${firstUpperCase(data.showType)} - ${firstUpperCase(data.status)}`, true)
				.addField('❯ Episodes', data.episodeCount ? formatNumber(data.episodeCount) : '???', true)
				.addField('❯ Start Date', data.startDate ? moment.utc(data.startDate).format('MM/DD/YYYY') : '???', true)
				.addField('❯ End Date', data.endDate ? moment.utc(data.endDate).format('MM/DD/YYYY') : '???', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
