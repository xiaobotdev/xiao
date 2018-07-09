const Command = require('../../structures/Command');
const { Collection, MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
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
					prompt: 'What Pokémon would you like to get information on?',
					type: 'string',
					parse: pokemon => encodeURIComponent(pokemon.toLowerCase().replace(/ /g, '-'))
				}
			]
		});

		this.cache = new Collection();
	}

	async run(msg, { pokemon }) {
		try {
			const data = await this.fetchPokemon(pokemon);
			const embed = new MessageEmbed()
				.setColor(0xED1C24)
				.setAuthor(
					`#${data.id} - ${data.name}`,
					`https://www.serebii.net/pokedex-sm/icon/${data.id}.png`,
					`https://www.serebii.net/pokedex-sm/${data.id}.shtml`
				)
				.setDescription(stripIndents`
					**The ${data.genus}**
					${this.filterPokemonData(data.entries).flavor_text.replace(/\n|\f|\r/g, ' ')}
				`)
				.setThumbnail(`https://www.serebii.net/sunmoon/pokemon/${data.id}.png`);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchPokemon(query) {
		if (this.cache.has(query)) return this.cache.get(query);
		const found = this.cache.find(
			pokemon => pokemon.name.toLowerCase() === query.toLowerCase() || pokemon.id === query
		);
		if (found) return found;
		const { body } = await request.get(`https://pokeapi.co/api/v2/pokemon-species/${query}/`);
		this.cache.set(body.id, {
			id: body.id.toString().padStart(3, '0'),
			name: this.filterPokemonData(body.names, false).name,
			genus: this.filterPokemonData(body.genera, false).genus,
			entries: body.flavor_text_entries
		});
		return this.cache.get(body.id);
	}

	filterPokemonData(arr, random = true) {
		const filtered = arr.filter(entry => entry.language.name === 'en');
		return filtered[random ? Math.floor(Math.random() * filtered.length) : 0];
	}
};
