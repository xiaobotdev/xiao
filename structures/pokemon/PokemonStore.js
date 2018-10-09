const { Collection } = require('discord.js');
const request = require('node-superfetch');
const Pokemon = require('./Pokemon');

module.exports = class PokemonStore extends Collection {
	async fetch(query) {
		query = encodeURIComponent(query.toLowerCase().replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/g, ''));
		const num = Number.parseInt(query, 10);
		if (this.has(num)) return this.get(num);
		const found = this.find(pokemon => pokemon.slug === query);
		if (found) return found;
		const { body } = await request.get(`https://pokeapi.co/api/v2/pokemon-species/${query}/`);
		const pokemon = new Pokemon(body);
		this.set(pokemon.id, pokemon);
		return pokemon;
	}
};
