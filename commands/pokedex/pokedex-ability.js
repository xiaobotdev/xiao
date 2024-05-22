const Command = require('../../framework/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class PokedexAbilityCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex-ability',
			aliases: ['pokemon-ability', 'pokémon-ability', 'pokédex-ability', 'pkmn-ability'],
			group: 'pokedex',
			description: 'Searches the Pokédex for a Pokémon ability.',
			clientPermissions: [PermissionFlagsBits.EmbedLinks],
			credit: [
				{
					name: 'Pokémon',
					url: 'https://www.pokemon.com/us/',
					reason: 'Original Game'
				},
				{
					name: 'PokéAPI',
					url: 'https://pokeapi.co/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'ability',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { ability }) {
		const data = await this.client.pokemon.abilities.fetch(ability);
		if (!data) return msg.say('Could not find any results.');
		const embed = new EmbedBuilder()
			.setColor(0xED1C24)
			.setTitle(data.name)
			.setDescription(data.description || 'No description available.');
		return msg.embed(embed);
	}
};
