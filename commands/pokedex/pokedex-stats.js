const Command = require('../../framework/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { stripIndents } = require('common-tags');
const { list } = require('../../util/Util');

module.exports = class PokedexCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex-stats',
			aliases: ['pokemon-stats', 'pokémon-stats', 'pokédex-stats', 'pkmn-stats'],
			group: 'pokedex',
			memberName: 'pokedex-stats',
			description: 'Responds with the stats for a Pokémon.',
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
				},
				{
					key: 'form',
					type: 'string',
					default: '',
					parse: form => {
						if (form.toLowerCase() === 'normal') return '';
						return form.toLowerCase();
					}
				}
			]
		});
	}

	async run(msg, { pokemon, form }) {
		if (!pokemon.gameDataCached) await pokemon.fetchGameData();
		const displayForms = pokemon.varieties.filter(vrity => vrity.statsDiffer);
		const variety = displayForms.find(vrity => {
			if (!form || form === 'normal') return vrity.default;
			if (!vrity.name) return false;
			return vrity.name.toLowerCase() === form;
		});
		if (!variety) {
			const varieties = displayForms.map(vrity => vrity.name || 'Normal');
			return msg.say(`Invalid form. The forms available for this Pokémon are: ${list(varieties, 'and')}`);
		}
		const statTotal = pokemon.baseStatTotal(variety.id);
		const repeat = {
			hp: Math.round((variety.stats.hp / 255) * 10) * 2,
			atk: Math.round((variety.stats.atk / 255) * 10) * 2,
			def: Math.round((variety.stats.def / 255) * 10) * 2,
			sAtk: Math.round((variety.stats.sAtk / 255) * 10) * 2,
			sDef: Math.round((variety.stats.sDef / 255) * 10) * 2,
			spd: Math.round((variety.stats.spd / 255) * 10) * 2,
			total: Math.round((statTotal / 1125) * 10) * 2
		};
		const embed = new EmbedBuilder()
			.setColor(0xED1C24)
			.setAuthor({
				name: `#${pokemon.displayID} - ${pokemon.name}`,
				iconURL: 'attachment://box.png',
				url: pokemon.serebiiURL
			})
			.setThumbnail(pokemon.formSpriteImageURL(variety.id))
			.addField(`❯ Base Stats (${variety.name || 'Normal'} Form)`, stripIndents`
				\`HP:          [${'█'.repeat(repeat.hp)}${' '.repeat(20 - repeat.hp)}]\` **${variety.stats.hp}**
				\`Attack:      [${'█'.repeat(repeat.atk)}${' '.repeat(20 - repeat.atk)}]\` **${variety.stats.atk}**
				\`Defense:     [${'█'.repeat(repeat.def)}${' '.repeat(20 - repeat.def)}]\` **${variety.stats.def}**
				\`Sp. Attack:  [${'█'.repeat(repeat.sAtk)}${' '.repeat(20 - repeat.sAtk)}]\` **${variety.stats.sAtk}**
				\`Sp. Defense: [${'█'.repeat(repeat.sDef)}${' '.repeat(20 - repeat.sDef)}]\` **${variety.stats.sDef}**
				\`Speed:       [${'█'.repeat(repeat.spd)}${' '.repeat(20 - repeat.spd)}]\` **${variety.stats.spd}**
				\`-----------------------------------\`
				\`Total:       [${'█'.repeat(repeat.total)}${' '.repeat(20 - repeat.total)}]\` **${statTotal}**
			`)
			.addField('❯ Abilities', variety.abilities.map(ability => ability.name).join('/'))
			.addField('❯ Other Forms', stripIndents`
				_Use ${this.usage(`${pokemon.id} <form>`)} to get stats for another form._

				**Forms Available:** ${displayForms.map(vrity => `\`${vrity.name || 'Normal'}\``).join(', ')}
			`);
		return msg.channel.send({
			embeds: [embed],
			files: [{
				attachment: await pokemon.generateBoxImage(),
				name: 'box.png'
			}]
		});
	}
};
