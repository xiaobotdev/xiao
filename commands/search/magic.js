const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const logos = require('../../assets/json/logos');

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
			flags: [
				{
					key: 'funny',
					description: 'Searches for silver-border and acorn cards.'
				},
				{
					key: 'f',
					description: 'Alias for funny.'
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

	async run(msg, { query, flags }) {
		const funny = Boolean(flags.funny || flags.f);
		const card = query ? await this.search(query, funny) : await this.random(funny);
		if (!card) {
			return msg.say(stripIndents`
				Could not find any results.
				${funny ? '' : '_Looking for silver-border or acorn cards? Use the `--funny` flag!_'}
			`);
		}
		const isMDFC = Boolean(card.card_faces);
		const oracleText = isMDFC ? card.card_faces.map(c => c.oracle_text).join('\n\n//\n\n') : card.oracle_text;
		const manaCost = isMDFC ? card.card_faces.map(c => c.mana_cost).join(' // ') : card.mana_cost;
		const embed = new MessageEmbed()
			.setURL(card.scryfall_uri)
			.setColor(0x2B253A)
			.setThumbnail(card.card_faces ? card.card_faces[0].image_uris.art_crop : card.image_uris.art_crop)
			.setDescription(`${manaCost} ${card.type_line}\n\n${oracleText}`)
			.setAuthor('Scryfall', logos.scryfall, 'https://scryfall.com/')
			.setTitle(card.name);
		if (card.power && card.toughness) {
			embed.addField('❯ Power', card.power, true);
			embed.addField('❯ Toughness', card.toughness, true);
			embed.addField('\u200B', '\u200B', true);
		}
		if (card.loyalty) {
			embed.addField('❯ Loyalty', card.loyalty);
		}
		embed.addField('❯ Price', stripIndents`
			**Non-Foil:** [${card.prices.usd ? `$${card.prices.usd}` : '???'}](${card.purchase_uris.tcgplayer})
			**Foil:** [${card.prices.usd_foil ? `$${card.prices.usd_foil}` : '???'}](${card.purchase_uris.tcgplayer})
		`);
		return msg.embed(embed);
	}

	async search(query, funny = false) {
		try {
			const { body } = await request
				.get('https://api.scryfall.com/cards/search')
				.query({ q: `${query} game:paper${funny ? ' is:funny' : ''}` });
			return body.data[0];
		} catch (err) {
			if (err.status === 404) return null;
			throw err;
		}
	}

	async random(funny) {
		const { body } = await request
			.get('https://api.scryfall.com/cards/random')
			.query({ q: `is:spell game:paper${funny ? ' is:funny' : ''}` });
		return body;
	}
};
