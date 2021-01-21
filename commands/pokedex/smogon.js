const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const genGames = [null, 'rb', 'gs', 'rs', 'dp', 'bw', 'xy', 'sm', 'ss'];
const games = {
	rb: 'Red/Blue',
	gs: 'Gold/Silver',
	rs: 'Ruby/Sapphire',
	dp: 'Diamond/Pearl',
	bw: 'Black/White',
	xy: 'X/Y',
	sm: 'Sun/Moon',
	ss: 'Sword/Shield'
};

module.exports = class SmogonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'smogon',
			aliases: ['pokemon-smogon', 'smogon-tier', 'pokémon-smogon', 'pkmn-smogon'],
			group: 'pokedex',
			memberName: 'smogon',
			description: 'Responds with the Smogon tiers for a Pokémon.',
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
					name: 'Smogon',
					url: 'https://www.smogon.com/',
					reason: 'Tier Data'
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
			const fetchGames = genGames.slice(data.generation, data.missingno ? 2 : genGames.length);
			if (!data.missingno) await data.fetchSmogonTiers(...fetchGames);
			const embed = new MessageEmbed()
				.setColor(0xED1C24)
				.setAuthor(`#${data.displayID} - ${data.name}`, data.boxImageURL, data.serebiiURL)
				.setThumbnail(data.spriteImageURL);
			for (const game of fetchGames) {
				embed.addField(`❯ ${games[game]}`, `[${data.smogonTiers[game].join('/')}](${data.smogonURL(game)})`, true);
			}
			if (fetchGames.length % 3 !== 0 && fetchGames.length > 3) {
				for (let i = 0; i < 3 - (fetchGames.length % 3); i++) {
					embed.addField('\u200B', '\u200B', true);
				}
			}
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
