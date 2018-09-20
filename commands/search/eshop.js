const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { list } = require('../../util/Util');
const systems = ['3ds', 'switch', 'wii_u'];

module.exports = class EshopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'eshop',
			aliases: ['nintendo-eshop'],
			group: 'search',
			memberName: 'eshop',
			description: 'Searches the Nintendo eShop for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'system',
					prompt: `What system's store do you want to search? Either ${list(systems, 'or')}.`,
					type: 'string',
					oneOf: systems,
					parse: system => system.toLowerCase()
				},
				{
					key: 'query',
					prompt: 'What game would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { system, query }) {
		try {
			const id = await this.search(system, query);
			if (!id) return msg.say('Could not find any results.');
			const data = await this.fetchGame(id);
			const embed = new MessageEmbed()
				.setColor(0xFF7D01)
				.setAuthor(
					`Nintendo eShop (${system})`,
					'https://i.imgur.com/lMh73lz.png',
					'https://www.nintendo.com/games/buy-digital'
				)
				.setURL(data.microsite_ref ? data.microsite_ref.microsite.url : null)
				.setThumbnail(data.front_box_art.image.image.url)
				.setTitle(data.title)
				.addField('❯ Price', data.eshop_price
					? data.eshop_price === '0.00' ? 'Free!' : `$${data.eshop_price}`
					: '???', true)
				.addField('❯ Category', data.game_category_ref
					? data.game_category_ref.length ? data.game_category_ref[0].title : data.game_category_ref.title
					: '???', true)
				.addField('❯ Release Date',
					data.release_date ? moment.utc(data.release_date).format('MM/DD/YYYY') : '???', true)
				.addField('❯ Player Count', data.number_of_players || '???', true)
				.addField('❯ DLC?', data.dlc === 'true' ? 'Yes' : 'No', true)
				.addField('❯ Demo?', data.demo === 'true' ? 'Yes' : 'No', true)
				.addField('❯ Developer', data.developer_ref ? data.developer_ref.title : '???', true)
				.addField('❯ Publisher', data.publisher_ref ? data.publisher_ref.title : '???', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async search(system, query) {
		const { text } = await request
			.get('https://www.nintendo.com/json/content/get/filter/game')
			.query({
				system,
				sort: 'title',
				direction: 'asc',
				search: query,
				limit: 1,
				availability: 'now'
			});
		const body = JSON.parse(text);
		return body.games.game ? body.games.game.id : null;
	}

	async fetchGame(id) {
		const { text } = await request.get(`https://www.nintendo.com/json/content/get/game/${id}`);
		return JSON.parse(text).game;
	}
};
