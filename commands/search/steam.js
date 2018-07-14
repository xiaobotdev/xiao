const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

module.exports = class SteamCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'steam',
			aliases: ['steam-game', 'game', 'video-game'],
			group: 'search',
			memberName: 'steam',
			description: 'Searches Steam for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What game would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const search = await request
				.get('https://store.steampowered.com/api/storesearch')
				.query({
					cc: 'us',
					l: 'en',
					term: query
				});
			if (!search.body.items.length) return msg.say('Could not find any results.');
			const { id, tiny_image } = search.body.items[0];
			const { body } = await request
				.get('https://store.steampowered.com/api/appdetails')
				.query({ appids: id });
			const { data } = body[id.toString()];
			const current = data.price_overview ? `$${data.price_overview.final / 100}` : 'Free';
			const original = data.price_overview ? `$${data.price_overview.initial / 100}` : 'Free';
			const price = current === original ? current : `~~${original}~~ ${current}`;
			const platforms = [];
			if (data.platforms) {
				if (data.platforms.windows) platforms.push('Windows');
				if (data.platforms.mac) platforms.push('Mac');
				if (data.platforms.linux) platforms.push('Linux');
			}
			const embed = new MessageEmbed()
				.setColor(0x101D2F)
				.setAuthor('Steam', 'https://i.imgur.com/xxr2UBZ.png', 'http://store.steampowered.com/')
				.setTitle(data.name)
				.setURL(`http://store.steampowered.com/app/${data.steam_appid}`)
				.setThumbnail(tiny_image)
				.addField('❯ Price', price, true)
				.addField('❯ Metascore', data.metacritic ? data.metacritic.score : '???', true)
				.addField('❯ Recommendations', data.recommendations ? data.recommendations.total : '???', true)
				.addField('❯ Platforms', platforms.join(', ') || 'None', true)
				.addField('❯ Release Date', data.release_date ? data.release_date.date : '???', true)
				.addField('❯ DLC Count', data.dlc ? data.dlc.length : 0, true)
				.addField('❯ Developers', data.developers ? data.developers.join(', ') || '???' : '???')
				.addField('❯ Publishers', data.publishers ? data.publishers.join(', ') || '???' : '???');
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
