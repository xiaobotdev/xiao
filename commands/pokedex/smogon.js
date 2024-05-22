const Command = require('../../framework/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { embedURL } = require('../../util/Util');
const genGames = [null, 'rb', 'gs', 'rs', 'dp', 'bw', 'xy', 'sm', 'ss', 'sv'];
const games = {
	rb: 'Red/Blue',
	gs: 'Gold/Silver',
	rs: 'Ruby/Sapphire',
	dp: 'Diamond/Pearl',
	bw: 'Black/White',
	xy: 'X/Y',
	sm: 'Sun/Moon',
	ss: 'Sword/Shield',
	sv: 'Scarlet/Violet'
};

module.exports = class SmogonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'smogon',
			aliases: ['pokemon-smogon', 'smogon-tier', 'pokémon-smogon', 'pkmn-smogon'],
			group: 'pokedex',
			description: 'Responds with the Smogon tiers for a Pokémon.',
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
					name: 'Smogon',
					url: 'https://www.smogon.com/',
					reason: 'Tier Data'
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
		const fetchGames = genGames.slice(pokemon.generation, pokemon.missingno ? 2 : genGames.length);
		if (!pokemon.missingno) await pokemon.fetchSmogonTiers(...fetchGames);
		const embed = new EmbedBuilder()
			.setColor(0xED1C24)
			.setAuthor({
				name: `#${pokemon.displayID} - ${pokemon.name}`,
				iconURL: 'attachment://box.png',
				url: pokemon.serebiiURL
			})
			.setThumbnail(pokemon.spriteImageURL);
		for (const game of fetchGames) {
			const tiers = pokemon.smogonTiers[game];
			embed.addField(`❯ ${games[game]}`, embedURL(tiers.join('/'), pokemon.smogonURL(game)), true);
		}
		if (fetchGames.length % 3 !== 0 && fetchGames.length > 3) {
			for (let i = 0; i < 3 - (fetchGames.length % 3); i++) {
				embed.addBlankField(true);
			}
		}
		return msg.channel.send({
			embeds: [embed],
			files: [{
				attachment: await pokemon.generateBoxImage(),
				name: 'box.png'
			}]
		});
	}
};
