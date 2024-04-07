const Command = require('../../framework/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class PokedexItemCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex-item',
			aliases: ['pokemon-item', 'pokémon-item', 'pokédex-item', 'pkmn-item'],
			group: 'pokedex',
			memberName: 'pokedex-item',
			description: 'Searches the Pokédex for a Pokémon item.',
			clientPermissions: [PermissionFlagsBits.EmbedLinks],
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
					type: 'string'
				}
			]
		});
	}

	async run(msg, { item }) {
		const data = await this.client.pokemon.items.fetch(item);
		if (!data) return msg.say('Could not find any results.');
		const embed = new EmbedBuilder()
			.setColor(0xED1C24)
			.setTitle(data.name)
			.setDescription(data.description || 'No description available.')
			.setThumbnail(data.spriteURL)
			.addField('❯ Cost', `${data.cost} ¥`, true);
		return msg.embed(embed);
	}
};
