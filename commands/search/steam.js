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

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch
				.get('https://store.steampowered.com/api/storesearch')
				.query({
					cc: 'us',
					l: 'en',
					term: query
				});
			if (!body.total) return msg.say('Could not find any results.');
			const data = body.items[0];
			const current = data.price ? data.price.final / 100 : 0.00;
			const original = data.price ? data.price.initial / 100 : 0.00;
			const price = current === original ? `$${current}` : `~~$${original}~~ $${current}`;
			const embed = new MessageEmbed()
				.setColor(0x101D2F)
				.setAuthor('Steam', 'https://i.imgur.com/vL8b4D5.png')
				.setTitle(data.name)
				.setURL(`http://store.steampowered.com/app/${data.id}`)
				.setImage(data.tiny_image)
				.addField('❯ Price',
					price, true)
				.addField('❯ Metascore',
					data.metascore || 'N/A', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
