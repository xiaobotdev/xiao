const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { MessageEmbed } = require('discord.js');

module.exports = class NeopetItemCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'neopets-item',
			aliases: ['jellyneo', 'jellyneo-item', 'jellyneo-item-database'],
			group: 'search',
			memberName: 'neopets-item',
			description: 'Responds with information on a specific Neopets item.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'item',
					prompt: 'What item would you like to get information on?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { item }) {
		try {
			const search = await snekfetch
				.get('https://items.jellyneo.net/search/')
				.query({
					name: item,
					name_type: 3
				});
			const id = search.text.match(/\/item\/([0-9]+)/);
			if (!id) return msg.say('Could not find any results.');
			const { text } = await snekfetch.get(`https://items.jellyneo.net/item/${id[1]}/`);
			const price = search.text.match(/[0-9,]+ (NP|NC)/);
			const embed = new MessageEmbed()
				.setColor(0xFFCE31)
				.setAuthor('Neopets', 'https://i.imgur.com/BP8qxJH.png')
				.setTitle(text.match(/<h1>(.+)<\/h1>/)[1])
				.setDescription(text.match(/<em>(.+)<\/em>/)[1])
				.setURL(`https://items.jellyneo.net/item/${id[1]}/`)
				.setThumbnail(`https://items.jellyneo.net/assets/imgs/items/${id[1]}.gif`)
				.addField('❯ Price',
					price ? price[0] : 'Unavailable');
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
