const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const versions = {
	'red-blue': 'Red and Blue',
	'ultra-sun-ultra-moon': 'Ultra Sun and Ultra Moon',
	'sword-shield': 'Sword and Shield'
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
			memberName: 'pokedex-moveset',
			description: 'Responds with the moveset for a Pokémon.',
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
					prompt: 'What Pokémon would you like to get information on?',
					type: 'pokemon'
				}
			]
		});
	}

	async run(msg, { pokemon }) {
		try {
			if (!pokemon.gameDataCached) await pokemon.fetchGameData();
			if (!pokemon.moveSet.length) return msg.say('This Pokémon\'s moves are not yet documented.');
			const embed = new MessageEmbed()
				.setColor(0xED1C24)
				.setAuthor(`#${pokemon.displayID} - ${pokemon.name}`, pokemon.boxImageURL, pokemon.serebiiURL)
				.setDescription(pokemon.moveSet.map(move => `**Level ${move.level}:** ${move.move.name}`).join('\n'))
				.setThumbnail(pokemon.spriteImageURL)
				.setFooter(`Moveset data taken from ${versions[pokemon.moveSetVersion]}.`);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
