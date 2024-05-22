const Command = require('../../framework/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const versions = {
	'red-blue': 'Red and Blue',
	'ultra-sun-ultra-moon': 'Ultra Sun and Ultra Moon',
	'sword-shield': 'Sword and Shield',
	'scarlet-violet': 'Scarlet and Violet'
};

module.exports = class PokedexMovesetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex-moveset',
			aliases: [
				'pokemon-moveset',
				'pokémon-moveset',
				'pokédex-moveset',
				'pkmn-moveset',
				'pokedex-moves',
				'pokémon-moves',
				'pokemon-moves',
				'pokédex-moves',
				'pkmn-moves'
			],
			group: 'pokedex',
			description: 'Responds with the moveset for a Pokémon.',
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
				},
				{
					name: 'Serebii.net',
					url: 'https://www.serebii.net/index2.shtml',
					reason: 'Images'
				},
				{
					name: 'Pokémon Showdown',
					url: 'https://play.pokemonshowdown.com/',
					reason: 'Box Sprite Sheet',
					reasonURL: 'https://play.pokemonshowdown.com/sprites/'
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

	async run(msg, { pokemon }) {
		if (!pokemon.gameDataCached) await pokemon.fetchGameData();
		if (!pokemon.moveSet.length) return msg.say('This Pokémon\'s moves are not yet documented.');
		const embed = new EmbedBuilder()
			.setColor(0xED1C24)
			.setAuthor({
				name: `#${pokemon.displayID} - ${pokemon.name}`,
				iconURL: 'attachment://box.png',
				url: pokemon.serebiiURL
			})
			.setDescription(pokemon.moveSet.map(move => `**Level ${move.level}:** ${move.move.name}`).join('\n'))
			.setThumbnail(pokemon.spriteImageURL)
			.setFooter({ text: `Moveset data taken from ${versions[pokemon.moveSetVersion]}.` });
		return msg.channel.send({
			embeds: [embed],
			files: [{
				attachment: await pokemon.generateBoxImage(),
				name: 'box.png'
			}]
		});
	}
};
