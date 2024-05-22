const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { reactIfAble } = require('../../util/Util');

module.exports = class PokedexCryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex-cry',
			aliases: ['pokemon-cry', 'pokémon-cry', 'pokédex-cry', 'pkmn-cry'],
			group: 'pokedex',
			description: 'Plays a Pokémon\'s cry.',
			userPermissions: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
			throttling: {
				usages: 2,
				duration: 10
			},
			guildOnly: true,
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
				},
				{
					name: 'The Sounds Resource',
					url: 'https://www.sounds-resource.com/',
					reason: 'Cry Sound Effects (Gen 1-7)',
					reasonURL: 'https://www.sounds-resource.com/3ds/pokemonultrasunultramoon/'
				},
				{
					name: 'The Sounds Resource',
					url: 'https://www.sounds-resource.com/',
					reason: 'Cry Sound Effects (Gen 8-9)',
					reasonURL: 'https://www.sounds-resource.com/nintendo_switch/pokemonswordshield/'
				},
				{
					name: 'Pokémon Showdown',
					url: 'https://play.pokemonshowdown.com/',
					reason: 'Cry Sound Effects (Meltan and Melmetal, Legends: Arceus)',
					reasonURL: 'https://play.pokemonshowdown.com/audio/cries/'
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
		const connection = this.client.dispatchers.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (!connection.canPlay) return msg.reply('I am already playing audio in this server.');
		try {
			connection.play(pokemon.cry);
			await reactIfAble(msg, this.client.user, '🔉');
			return null;
		} catch (err) {
			await reactIfAble(msg, this.client.user, '⚠️');
			throw err;
		}
	}
};
