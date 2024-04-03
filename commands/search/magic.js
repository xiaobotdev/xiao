const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const logos = require('../../assets/json/logos');
const funny = [
	'cheatyface',
	'rainbow dash',
	'pinkie pie',
	'twilight sparkle',
	'applejack',
	'fluttershy',
	'rarity',
	'nightmare moon',
	'princess luna',
	'discord',
	'discord, lord of disharmony'
];

module.exports = class MagicCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'magic',
			aliases: ['mtg', 'mtg-card', 'magic-the-gathering', 'magic-the-gathering-card'],
			group: 'search',
			memberName: 'magic',
			description: 'Responds with info on a Magic: The Gathering card.',
			credit: [
				{
					name: 'Wizards of the Coast',
					url: 'https://company.wizards.com/en',
					reason: 'Original Game',
					reasonURL: 'https://magic.wizards.com/en'
				},
				{
					name: 'Scryfall',
					url: 'https://scryfall.com/',
					reason: 'API',
					reasonURL: 'https://scryfall.com/docs/api'
				}
			],
			args: [
				{
					key: 'query',
					type: 'string',
					max: 500,
					default: ''
				}
			]
		});
	}

	async run(msg, { query }) {
		const card = query ? await this.search(query) : await this.random();
		const isMDFC = Boolean(card.card_faces);
		const oracleText = isMDFC ? card.card_faces.map(c => c.oracle_text).join('\n\n//\n\n') : card.oracle_text;
		const manaCost = isMDFC ? card.card_faces.map(c => c.mana_cost).join(' // ') : card.mana_cost;
		const embed = new MessageEmbed()
			.setURL(card.scryfall_uri)
			.setThumbnail(card.card_faces ? card.card_faces[0].image_uris.art_crop : card.image_uris.art_crop)
			.setDescription(`${manaCost} ${card.type_line}\n\n${oracleText}`)
			.setAuthor('Scryfall', logos.scryfall, 'https://scryfall.com/')
			.setTitle(card.name)
			.addField('❯ Price', stripIndents`
				**Non-Foil:** [${card.prices.usd ? `$${card.prices.usd}` : '???'}](${card.purchase_uris.tcgplayer})
				**Foil:** [${card.prices.usd_foil ? `$${card.prices.usd_foil}` : '???'}](${card.purchase_uris.tcgplayer})
			`);
		return msg.embed(embed);
	}

	async search(query) {
		try {
			const isFunny = funny.includes(query);
			const { body } = await request
				.get('https://api.scryfall.com/cards/search')
				.query({ q: `${query}${isFunny ? ' is:funny' : ''}` });
			return body.data[0];
		} catch (err) {
			if (err.status === 404) return null;
			throw err;
		}
	}

	async random() {
		const { body } = await request
			.get('https://api.scryfall.com/cards/random')
			.query({ q: 'is:spell game:paper' });
		return body;
	}
};
