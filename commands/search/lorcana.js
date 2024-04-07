const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');
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
		const embed = new MessageEmbed()
			.setURL(card.Image)
			.setColor(0xD3B078)
			.setThumbnail(card.Image)
			.setDescription(`{${card.Cost}} ${card.Type}${classifications}\n\n${oracleText}`)
			.setAuthor('Lorcana', logos.lorcana, 'https://www.disneylorcana.com/en-US')
			.setTitle(card.Name)
			.setFooter(`${card.Set_Name} - ${card.Card_Num}`)
			.addField('❯ Color', card.Color, true)
			.addField('❯ Inkable?', card.Inkable ? 'Yes' : 'No', true)
			.addField('\u200B', '\u200B', true);
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
		const results = this.cache.filter(card => {
			const q = query.replace(/( -)|,/g, '');
			return card.Name.toLowerCase().replace(/( -)|,/g, '').includes(q.toLowerCase());
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
