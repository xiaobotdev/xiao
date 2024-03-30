const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const versions = require('../../assets/json/pokedex-location');

module.exports = class PokedexLocationCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex-location',
			aliases: [
				'pokemon-location',
				'pokémon-location',
				'pokédex-location',
				'pkmn-location',
				'pokedex-locate',
				'pokémon-locate',
				'pokemon-locate',
				'pokédex-locate',
				'pkmn-locate'
			],
			group: 'pokedex',
			memberName: 'pokedex-location',
			description: 'Responds with the location data for a Pokémon.',
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
		try {
			if (!pokemon.gameDataCached) await pokemon.fetchGameData();
			if (!pokemon.encounters) await pokemon.fetchEncounters();
			const desc = pokemon.encounters.length
				? pokemon.encounters
					.map(location => `${location.name} (${location.versions.map(v => versions[v]).join('/')})`)
					.join('\n')
				: 'Location Unknown';
			const embed = new MessageEmbed()
				.setColor(0xED1C24)
				.setAuthor(`#${pokemon.displayID} - ${pokemon.name}`, 'attachment://box.png', pokemon.serebiiURL)
				.setDescription(desc)
				.setThumbnail(pokemon.spriteImageURL);
			return msg.channel.send({
				embeds: [embed],
				files: [{
					attachment: await pokemon.generateBoxImage(),
					name: 'box.png'
				}]
			});
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
