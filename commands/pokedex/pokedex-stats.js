const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { arrayEquals } = require('../../util/Util');

module.exports = class PokedexCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex-stats',
			aliases: ['pokemon-stats', 'pokémon-stats', 'pokédex-stats', 'pkmn-stats'],
			group: 'pokedex',
			memberName: 'pokedex',
			description: 'Responds with the stats for a Pokémon.',
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
			const defaultVariety = data.varieties.find(variety => variety.default);
			const abilitiesShown = data.varieties.filter(variety => {
				if (variety.default) return true;
				return !arrayEquals(defaultVariety.abilities, variety.abilities);
			});
			const repeat = {
				hp: Math.round((data.stats.hp / 255) * 10) * 2,
				atk: Math.round((data.stats.atk / 255) * 10) * 2,
				def: Math.round((data.stats.def / 255) * 10) * 2,
				sAtk: Math.round((data.stats.sAtk / 255) * 10) * 2,
				sDef: Math.round((data.stats.sDef / 255) * 10) * 2,
				spd: Math.round((data.stats.spd / 255) * 10) * 2,
				total: Math.round((data.baseStatTotal / 720) * 10) * 2
			};
			const embed = new MessageEmbed()
				.setColor(0xED1C24)
				.setAuthor(`#${data.displayID} - ${data.name}`, data.boxImageURL, data.serebiiURL)
				.setDescription(stripIndents`
					**${data.genus}**
					${data.entries[Math.floor(Math.random() * data.entries.length)]}
				`)
				.setThumbnail(data.spriteImageURL)
				.addField('❯ Base Stats (Base Form)', stripIndents`
					\`HP:          [${'█'.repeat(repeat.hp)}${' '.repeat(20 - repeat.hp)}]\` **${data.stats.hp}**
					\`Attack:      [${'█'.repeat(repeat.atk)}${' '.repeat(20 - repeat.atk)}]\` **${data.stats.atk}**
					\`Defense:     [${'█'.repeat(repeat.def)}${' '.repeat(20 - repeat.def)}]\` **${data.stats.def}**
					\`Sp. Attack:  [${'█'.repeat(repeat.sAtk)}${' '.repeat(20 - repeat.sAtk)}]\` **${data.stats.sAtk}**
					\`Sp. Defense: [${'█'.repeat(repeat.sDef)}${' '.repeat(20 - repeat.sDef)}]\` **${data.stats.sDef}**
					\`Speed:       [${'█'.repeat(repeat.spd)}${' '.repeat(20 - repeat.spd)}]\` **${data.stats.spd}**
					\`-----------------------------------\`
					\`Total:       [${'█'.repeat(repeat.total)}${' '.repeat(20 - repeat.total)}]\` **${data.baseStatTotal}**
				`)
				.addField('❯ Abilities', abilitiesShown.map(variety => {
					const showParens = variety.name && abilitiesShown.length > 1;
					return `${variety.abilities.join('/')}${showParens ? ` (${variety.name})` : ''}`;
				}).join('\n'));
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
