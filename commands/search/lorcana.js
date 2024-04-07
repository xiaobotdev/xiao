const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { EmbedBuilder } = require('discord.js');
const logos = require('../../assets/json/logos');

module.exports = class LorcanaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lorcana',
			aliases: ['lorcana-card'],
			group: 'search',
			memberName: 'lorcana',
			description: 'Responds with info on a Lorcana card.',
			credit: [
				{
					name: 'Ravensburger',
					url: 'https://www.disneylorcana.com/en-US',
					reason: 'Original Game'
				},
				{
					name: 'Lorcana API',
					url: 'https://lorcana-api.com/Home.html',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'query',
					type: 'string',
					max: 500
				}
			]
		});

		this.cache = null;
	}

	async run(msg, { query }) {
		const card = await this.search(query);
		if (!card) return msg.say('Could not find any results.');
		const oracleText = card.Body_Text ? card.Body_Text.replace(/{i}/g, 'Ink') : `_${card.Flavor_Text}_`;
		const classifications = card.Classifications ? `- ${card.Classifications}` : '';
		const embed = new EmbedBuilder()
			.setURL(card.Image)
			.setColor(0xD3B078)
			.setThumbnail(card.Image)
			.setDescription(`{${card.Cost}} ${card.Type}${classifications}\n\n${oracleText}`)
			.setAuthor({ name: 'Lorcana', iconURL: logos.lorcana, url: 'https://www.disneylorcana.com/en-US' })
			.setTitle(card.Name)
			.setFooter({ text: `${card.Set_Name} - ${card.Card_Num}` })
			.addField('❯ Color', card.Color, true)
			.addField('❯ Inkable?', card.Inkable ? 'Yes' : 'No', true)
			.addBlankField(true);
		if (card.Type === 'Character') {
			embed.addField('❯ Strength', card.Strength.toString(), true);
			embed.addField('❯ Willpower', card.Willpower.toString(), true);
			embed.addField('❯ Lore', card.Lore ? card.Lore.toString() : '0', true);
		}
		if (card.Type === 'Location') {
			embed.addField('❯ Willpower', card.Willpower.toString(), true);
			embed.addField('❯ Move Cost', card.Move_Cost.toString(), true);
			embed.addField('❯ Lore', card.Lore ? card.Lore.toString() : '0', true);
		}
		return msg.embed(embed);
	}

	async search(query) {
		if (!this.cache) await this.fetchCards();
		const q = query.replace(/( -)|,/g, '');
		const exactResults = this.cache.filter(card => {
			const slug = card.Name.toLowerCase().replace(/( -)|,/g, '');
			return slug === q;
		});
		if (exactResults.length) return exactResults[0];
		const results = this.cache.filter(card => {
			const slug = card.Name.toLowerCase().replace(/( -)|,/g, '');
			return slug.includes(q.toLowerCase());
		});
		if (!results.length) return null;
		return results[0];
	}

	async fetchCards() {
		const { body } = await request.get('https://api.lorcana-api.com/cards/all');
		this.cache = body;
		return this.cache;
	}
};
