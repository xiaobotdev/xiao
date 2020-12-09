const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

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
			group: 'search',
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
					type: 'string'
				}
			]
		});
	}

	async run(msg, { pokemon }) {
		try {
			const data = await this.client.pokemon.fetch(pokemon);
			if (!data) return msg.say('Could not find any results.');
			if (!data.gameDataCached) await data.fetchGameData();
			const embed = new MessageEmbed()
				.setColor(0xED1C24)
				.setAuthor(`#${data.displayID} - ${data.name}`, data.boxImageURL, data.serebiiURL)
				.setDescription(data.moveSet.map(move => `**Level ${move.level}:** ${move.name}`).join('\n'))
				.setThumbnail(data.spriteImageURL);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
