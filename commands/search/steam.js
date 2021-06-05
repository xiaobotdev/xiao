const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { formatNumber } = require('../../util/Util');

module.exports = class SteamCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'steam',
			group: 'search',
			memberName: 'steam',
			description: 'Searches Steam for your query.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Steam',
					url: 'https://store.steampowered.com/',
					reason: 'API'
				}
			],
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
			const id = await this.search(query);
			if (!id) return msg.say('Could not find any results.');
			const data = await this.fetchGame(id);
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
				.setThumbnail(data.header_image)
				.addField('❯ Price', price, true)
				.addField('❯ Metascore', data.metacritic ? data.metacritic.score : '???', true)
				.addField('❯ Recommendations', data.recommendations ? formatNumber(data.recommendations.total) : '???', true)
				.addField('❯ Platforms', platforms.join(', ') || 'None', true)
				.addField('❯ Release Date', data.release_date ? data.release_date.date : '???', true)
				.addField('❯ DLC Count', data.dlc ? formatNumber(data.dlc.length) : 0, true)
				.addField('❯ Developers', data.developers ? data.developers.join(', ') || '???' : '???')
				.addField('❯ Publishers', data.publishers ? data.publishers.join(', ') || '???' : '???');
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async search(query) {
		const { body } = await request
			.get('https://store.steampowered.com/api/storesearch')
			.query({
				cc: 'us',
				l: 'en',
				term: query
			});
		if (!body.items.length) return null;
		return body.items[0].id;
	}

	async fetchGame(id) {
		const { body } = await request
			.get('https://store.steampowered.com/api/appdetails')
			.query({ appids: id });
		return body[id.toString()].data;
	}
};
