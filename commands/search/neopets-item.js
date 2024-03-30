const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');
const { formatNumber } = require('../../util/Util');

module.exports = class NeopetsItemCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'neopets-item',
			aliases: ['neo-item'],
			group: 'search',
			memberName: 'neopets-item',
			description: 'Responds with information on a specific Neopets item.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Neopets',
					url: 'http://www.neopets.com/',
					reason: 'Original Game'
				},
				{
					name: 'JellyNeo Item Database',
					url: 'https://items.jellyneo.net/',
					reason: 'Item Data'
				}
			],
			args: [
				{
					key: 'item',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { item }) {
		const data = await this.fetchItem(item);
		if (!data) return msg.say('Could not find any results.');
		const embed = new MessageEmbed()
			.setColor(0xFFCE31)
			.setAuthor('Neopets', 'https://i.imgur.com/BP8qxJH.png', 'http://www.neopets.com/')
			.setTitle(data.name)
			.setDescription(data.details)
			.setURL(data.url)
			.setThumbnail(data.image)
			.addField('❯ Price', data.price ? `${formatNumber(data.price)} ${data.currency}` : 'Not for Sale');
		return msg.embed(embed);
	}

	async fetchItem(query) {
		const { text } = await request
			.get('https://items.jellyneo.net/search/')
			.query({
				name: query,
				name_type: 3
			});
		const id = text.match(/\/item\/([0-9]+)/);
		if (!id) return null;
		const price = text.match(/>([0-9,]+) (NP|NC)</);
		const url = `https://items.jellyneo.net/item/${id[1]}/`;
		const details = (await request.get(url)).text;
		return {
			id: id[1],
			url,
			name: details.match(/<h1>(.+)<\/h1>/)[1],
			details: details.match(/<em>(.+)<\/em>/)[1],
			image: `https://items.jellyneo.net/assets/imgs/items/${id[1]}.gif`,
			price: price ? Number.parseInt(price[1].replaceAll(',', ''), 10) : null,
			currency: price ? price[2] : null
		};
	}
};
