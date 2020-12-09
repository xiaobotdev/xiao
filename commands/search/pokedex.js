const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { arrayEquals, firstUpperCase, reactIfAble } = require('../../util/Util');

module.exports = class PokedexCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex',
			aliases: ['pokemon', 'pokémon', 'pokédex', 'pkmn'],
			group: 'search',
			memberName: 'pokedex',
			description: 'Searches the Pokédex for a Pokémon.',
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
					name: 'The Sounds Resource',
					url: 'https://www.sounds-resource.com/',
					reason: 'Cry Sound Effects (Gen 1-7)',
					reasonURL: 'https://www.sounds-resource.com/3ds/pokemonultrasunultramoon/'
				},
				{
					name: 'The Sounds Resource',
					url: 'https://www.sounds-resource.com/',
					reason: 'Cry Sound Effects (Gen 8)',
					reasonURL: 'https://www.sounds-resource.com/nintendo_switch/pokemonswordshield/'
				},
				{
					name: 'Pokémon Showdown',
					url: 'https://play.pokemonshowdown.com/',
					reason: 'Cry Sound Effects (Meltan and Melmetal)',
					reasonURL: 'https://play.pokemonshowdown.com/audio/cries/'
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
			const typesShown = data.varieties.filter(variety => {
				if (variety.default) return true;
				return !arrayEquals(defaultVariety.types, variety.types);
			});
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
			const feet = Math.floor(data.height / 12);
			const embed = new MessageEmbed()
				.setColor(0xED1C24)
				.setAuthor(`#${data.displayID} - ${data.name}`, data.boxImageURL, data.serebiiURL)
				.setDescription(stripIndents`
					**${data.genus}**
					${data.entries[Math.floor(Math.random() * data.entries.length)]}
				`)
				.setThumbnail(data.spriteImageURL)
				.addField('❯ Class', firstUpperCase(data.class), true)
				.addField('❯ Height', `${feet}'${Math.round(data.height % 12)}"`, true)
				.addField('❯ Weight', `${data.weight} lbs.`, true)
				.addField('❯ Types', typesShown.map(variety => {
					const showParens = variety.name && typesShown.length > 1;
					return `${variety.types.join('/')}${showParens ? ` (${variety.name})` : ''}`;
				}).join('\n'))
				.addField('❯ Evolution Chain', data.chain.data.map(pkmn => {
					if (Array.isArray(pkmn)) {
						return pkmn.map(pkmn2 => {
							const found = this.client.pokemon.get(pkmn2);
							if (found.id === data.id) return `**${found.name}**`;
							return found.name;
						}).join('/');
					}
					const found = this.client.pokemon.get(pkmn);
					if (found.id === data.id) return `**${found.name}**`;
					return found.name;
				}).join(' -> '))
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
				}).join('\n'))
				.addField('❯ Gender Rate',
					data.genderRate.genderless ? 'Genderless' : `♂️ ${data.genderRate.male}% ♀️ ${data.genderRate.female}%`);
			if (data.cry) {
				const connection = msg.guild ? this.client.voice.connections.get(msg.guild.id) : null;
				const moveUsage = this.client.registry.commands.get('pokedex-moveset').usage();
				if (connection) {
					embed.setFooter(`Use ${moveUsage} to get the Pokémon's moveset.`);
					connection.play(data.cry);
					await reactIfAble(msg, this.client.user, '🔉');
				} else {
					const usage = this.client.registry.commands.get('join').usage();
					embed.setFooter(stripIndents`
						Join a voice channel and use ${usage} to hear the Pokémon's cry.
						Use ${moveUsage} to get the Pokémon's moveset.
					`);
				}
			}
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
