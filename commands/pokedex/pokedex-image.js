const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class PokedexImageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex-image',
			aliases: [
				'pokemon-image',
				'pokémon-image',
				'pokédex-image',
				'pkmn-image',
				'pokedex-img',
				'pokémon-img',
				'pokemon-img',
				'pokédex-img',
				'pkmn-img'
			],
			group: 'pokedex',
			memberName: 'pokedex-image',
			description: 'Responds with the image of a Pokémon.',
			clientPermissions: [PermissionFlagsBits.AttachFiles],
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
				},
				{
					name: 'Serebii.net',
					url: 'https://www.serebii.net/index2.shtml',
					reason: 'Images'
				}
			],
			args: [
				{
					key: 'pokemon',
					type: 'pokemon'
				}
			]
		});
	}

	run(msg, { pokemon }) {
		return msg.say(`#${pokemon.displayID} - ${pokemon.name}`, { files: [pokemon.spriteImageURL] });
	}
};
