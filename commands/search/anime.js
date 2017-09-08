const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../structures/Util');

module.exports = class AnimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'anime',
			aliases: ['my-anime-list-anime', 'mal-anime', 'kitsu-anime'],
			group: 'search',
			memberName: 'anime',
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

	async run(msg, args) {
		const { query } = args;
		try {
			const { text } = await snekfetch
				.get('https://kitsu.io/api/edge/anime')
				.query({ 'filter[text]': query });
			const body = JSON.parse(text);
			if (!body.meta.count) return msg.say('Could not find any results.');
			const embed = new MessageEmbed()
				.setColor(0xF75239)
				.setAuthor('Kitsu.io', 'https://i.imgur.com/VnIpwgF.png')
				.setThumbnail(body.data[0].attributes.posterImage ? body.data[0].attributes.posterImage.original : null)
				.setTitle(body.data[0].attributes.canonicalTitle)
				.setDescription(shorten(body.data[0].attributes.synopsis))
				.addField('❯ Type',
					`${body.data[0].attributes.showType} - ${body.data[0].attributes.status}`, true)
				.addField('❯ Episodes',
					body.data[0].attributes.episodeCount || 'N/A', true)
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
