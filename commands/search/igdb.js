const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../util/Util');
const { IGDB_KEY } = process.env;
const esrb = ['RP', 'EC', 'E', 'E10+', 'T', 'M', 'AO'];
const statuses = ['Released', '???', 'Alpha', 'Beta', 'Early Access', 'Offline', 'Cancelled'];

module.exports = class IGDBCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'igdb',
			aliases: ['igdb-video-game', 'game', 'video-game', 'game'],
			group: 'search',
			memberName: 'igdb',
			description: 'Searches IGDB for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What video game would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch
				.get('https://api-2445582011268.apicast.io/games/')
				.query({
					search: query,
					limit: 1,
					fields: '*',
					'filter[version_parent][not_exists]': 1
				})
				.set({ 'user-key': IGDB_KEY });
			const data = body[0];
			const embed = new MessageEmbed()
				.setColor(0x01DF6B)
				.setTitle(data.name)
				.setURL(data.url)
				.setAuthor('IGDB', 'https://i.imgur.com/LHLQEns.png')
				.setDescription(data.summary ? shorten(data.summary) : 'No description available.')
				.setThumbnail(data.cover ? data.cover.url : null)
				.addField('❯ ESRB Rating',
					data.esrb ? esrb[data.esrb.rating] : '???', true)
				.addField('❯ Release Date',
					data.first_release_date ? new Date(data.first_release_date).toDateString() : '???', true)
				.addField('❯ Status',
					data.status ? statuses[data.status] : '???', true)
				.addField('❯ Score',
					data.total_rating || '???', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
