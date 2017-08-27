const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class SteamCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'steam',
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

	async run(msg, args) {
		const { query } = args;
		try {
			const { body } = await snekfetch
				.get('https://store.steampowered.com/api/storesearch')
				.query({
					cc: 'us',
					l: 'en',
					term: query
				});
			if (!body.total) return msg.say('Could not find any results.');
			const current = body.items[0].price ? body.items[0].price.final / 100 : 0.00;
			const original = body.items[0].price ? body.items[0].price.initial / 100 : 0.00;
			const price = current === original ? `$${current}` : `~~$${original}~~ $${current}`;
			const embed = new MessageEmbed()
				.setColor(0x101D2F)
				.setAuthor('Steam', 'https://i.imgur.com/vL8b4D5.png')
				.setTitle(body.items[0].name)
				.setURL(`http://store.steampowered.com/app/${body.items[0].id}`)
				.setImage(body.items[0].tiny_image)
				.addField('❯ Price',
					price, true)
				.addField('❯ Metascore',
					body.items[0].metascore || 'N/A', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
