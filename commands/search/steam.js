const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { cleanHTML } = require('../../structures/Util');

module.exports = class SteamCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'steam',
			aliases: ['steam-game'],
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
			const search = await snekfetch
				.get('https://store.steampowered.com/api/storesearch')
				.query({
					cc: 'us',
					l: 'en',
					term: query
				});
			if (!search.body.total) return msg.say('Could not find any results.');
			const { body } = await snekfetch
				.get('http://store.steampowered.com/api/appdetails')
				.query({ appids: search.body.items[0].id });
			const { data } = body[search.body.items[0].id.toString()];
			const current = data.price_overview ? data.price_overview.final / 100 : 0;
			const original = data.price_overview ? data.price_overview.initial / 100 : 0;
			const price = current === original ? `$${current}` : `~~$${original}~~ $${current}`;
			const platforms = [];
			if (data.platforms) {
				if (data.platforms.windows) platforms.push('Windows');
				if (data.platforms.mac) platforms.push('Mac');
				if (data.platforms.linux) platforms.push('Linux');
			}
			const embed = new MessageEmbed()
				.setColor(0x101D2F)
				.setAuthor('Steam', 'https://i.imgur.com/xxr2UBZ.png')
				.setTitle(data.name)
				.setDescription(cleanHTML(data.short_description))
				.setURL(`http://store.steampowered.com/app/${data.steam_appid}`)
				.setImage(data.header_image)
				.addField('❯ Price',
					price, true)
				.addField('❯ Metascore',
					data.metacritic ? data.metacritic.score : 'N/A', true)
				.addField('❯ Recommendations',
					data.recommendations ? data.recommendations.total : 'N/A', true)
				.addField('❯ Platforms',
					platforms.join(', ') || 'None')
				.addField('❯ Developers',
					data.developers.join(', ') || 'N/A')
				.addField('❯ Publishers',
					data.publishers.join(', ') || 'N/A');
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
