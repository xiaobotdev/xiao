const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class PokedexItemCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex-item',
			aliases: ['pokemon-item', 'pokémon-item', 'pokédex-item', 'pkmn-item'],
			group: 'pokedex',
			memberName: 'pokedex-item',
			description: 'Searches the Pokédex for a Pokémon item.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Pokémon',
					url: 'https://www.pokemon.com/us/',
					reason: 'Images, Original Game'
				},
				{
					name: 'PokéAPI',
					url: 'https://pokeapi.co/',
					reason: 'API'
				}
			],
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
			const data = await this.client.pokemon.items.fetch(item);
			if (!data) return msg.say('Could not find any results.');
			const embed = new MessageEmbed()
				.setColor(0xED1C24)
				.setTitle(data.name)
				.setDescription(data.description || 'No description available.')
				.setThumbnail(data.spriteURL)
				.addField('❯ Cost', `${data.cost} ¥`, true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
