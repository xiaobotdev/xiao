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
			const search = await this.fetchItem(item);
			if (!search) return msg.say('Could not find any results');
			const data = await this.fetchItemDetails(search);
			const embed = new MessageEmbed()
				.setColor(0xFFCE31)
				.setAuthor('Neopets', 'https://i.imgur.com/BP8qxJH.png', 'http://www.neopets.com/')
				.setTitle(data.name)
				.setDescription(data.details)
				.setURL(data.url)
				.setThumbnail(data.image)
				.addField('❯ Price',
					data.price ? `${data.price} ${data.currency}` : 'Not for Sale');
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchItem(query) {
		const { text } = await snekfetch
			.get('https://items.jellyneo.net/search/')
			.query({
				name: query,
				name_type: 3
			});
		const id = text.match(/\/item\/([0-9]+)/);
		if (!id) return null;
		const price = text.match(/([0-9,]+) (NP|NC)/);
		return {
			id: id[1],
			url: `https://items.jellyneo.net/item/${id[1]}/`,
			image: `https://items.jellyneo.net/assets/imgs/items/${id[1]}.gif`,
			price: price ? Number.parseInt(price[1].replace(/,/g, ''), 10) : null,
			currency: price ? price[2] : null
		};
	}

	async fetchItemDetails(item) {
		const { text } = await snekfetch.get(item.url);
		return {
			...item,
			name: text.match(/<h1>(.+)<\/h1>/)[1],
			details: text.match(/<em>(.+)<\/em>/)[1]
		};
	}
};
