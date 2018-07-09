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
					parse: pokemon => this.makeSlug(pokemon)
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
					`#${data.displayID} - ${data.name}`,
					`https://www.serebii.net/pokedex-sm/icon/${data.displayID}.png`,
					`https://www.serebii.net/pokedex-sm/${data.displayID}.shtml`
				)
				.setDescription(stripIndents`
					**The ${data.genus}**
					${data.entries[Math.floor(Math.random() * data.entries.length)]}
				`)
				.setThumbnail(`https://www.serebii.net/sunmoon/pokemon/${data.displayID}.png`);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchPokemon(query) {
		const num = Number.parseInt(query, 10);
		if (this.cache.has(num)) return this.cache.get(num);
		const found = this.cache.find(pokemon => pokemon.slug === query);
		if (found) return found;
		const { body } = await request.get(`https://pokeapi.co/api/v2/pokemon-species/${query}/`);
		const entries = body.flavor_text_entries
			.filter(entry => entry.language.name === 'en')
			.map(entry => entry.flavor_text.replace(/\n|\f|\r/g, ' '));
		const { name } = this.filterPokemonData(body.names);
		this.cache.set(body.id, {
			id: body.id,
			displayID: body.id.toString().padStart(3, '0'),
			name,
			slug: this.makeSlug(name),
			genus: this.filterPokemonData(body.genera).genus,
			entries
		});
		return this.cache.get(body.id);
	}

	filterPokemonData(arr) {
		const filtered = arr.filter(entry => entry.language.name === 'en');
		return filtered[0];
	}

	makeSlug(name) {
		return encodeURIComponent(name.toLowerCase().replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/g, ''));
	}
};
