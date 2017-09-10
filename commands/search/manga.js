const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../structures/Util');

module.exports = class MangaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'manga',
			aliases: ['my-anime-list-manga', 'mal-manga', 'kitsu-manga'],
			group: 'search',
			memberName: 'manga',
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

	async run(msg, args) {
		const { query } = args;
		try {
			const { text } = await snekfetch
				.get('https://kitsu.io/api/edge/manga')
				.query({ 'filter[text]': query });
			const body = JSON.parse(text);
			if (!body.meta.count) return msg.say('Could not find any results.');
			const embed = new MessageEmbed()
				.setColor(0xF75239)
				.setAuthor('Kitsu.io', 'https://i.imgur.com/VnIpwgF.png')
				.setURL(`https://kitsu.io/manga/${body.data[0].attributes.slug}`)
				.setThumbnail(body.data[0].attributes.posterImage ? body.data[0].attributes.posterImage.original : null)
				.setTitle(body.data[0].attributes.canonicalTitle)
				.setDescription(shorten(body.data[0].attributes.synopsis))
				.addField('❯ Type',
					`${body.data[0].attributes.subtype} - ${body.data[0].attributes.status}`, true)
				.addField('❯ Volumes / Chapters',
					`${body.data[0].attributes.volumeCount || 'N/A'} / ${body.data[0].attributes.chapterCount || 'N/A'}`, true)
				.addField('❯ Start Date',
					body.data[0].attributes.startDate ? new Date(body.data[0].attributes.startDate).toDateString() : 'N/A', true)
				.addField('❯ End Date',
					body.data[0].attributes.endDate ? new Date(body.data[0].attributes.endDate).toDateString() : 'N/A', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
