const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');

module.exports = class PokedexCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex',
			aliases: ['pokemon', 'pokémon', 'pokédex'],
			group: 'search',
			memberName: 'pokedex',
			description: 'Searches the Pokédex for a Pokémon.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'pokemon',
					prompt: 'What Pokémon would you like to search for?',
					type: 'string',
					parse: pokemon => pokemon.toLowerCase().replace(/[ ]/g, '-')
				}
			]
		});
	}

	async run(msg, args) {
		const { pokemon } = args;
		try {
			const { body } = await snekfetch
				.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
			const id = `${'000'.slice(body.id.toString().length)}${body.id}`;
			const name = this.filter(body.names).name;
			const flavor = this.filter(body.flavor_text_entries).flavor_text.replace(/\n/g, ' ');
			const species = this.filter(body.genera).genus;
			const embed = new MessageEmbed()
				.setColor(0xED1C24)
				.setAuthor(`#${id} - ${name}`, `https://www.serebii.net/pokedex-sm/icon/${id}.png`)
				.setURL(`https://www.serebii.net/pokedex-sm/${id}.shtml`)
				.setDescription(stripIndents`
					**The ${species} Pokémon**
					${flavor}
				`)
				.setThumbnail(`https://www.serebii.net/sunmoon/pokemon/${id}.png`);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Pokémon Not Found.');
			throw err;
		}
	}

	filter(arr) {
		const filtered = arr.filter(entry => entry.language.name === 'en');
		return filtered[Math.floor(Math.random() * filtered.length)];
	}
};
