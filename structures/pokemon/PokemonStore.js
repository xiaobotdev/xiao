const Collection = require('@discordjs/collection');
const request = require('node-superfetch');
const Pokemon = require('./Pokemon');
const missingno = require('../../assets/json/missingno');

module.exports = class PokemonStore extends Collection {
	constructor(options) {
		super(options);

		this.pokemonCount = 898;
		this.pokemonCountWithCry = 893;
		this.smogonData = {};
	}

	async fetch(query) {
		query = this.makeSlug(query);
		if (!query) return null;
		const num = Number.parseInt(query, 10);
		if (this.has(num)) return this.get(num);
		const found = this.find(pokemon => pokemon.slug === query);
		if (found) return found;
		if (query === 'missingno' || num === 0) {
			const pokemon = new Pokemon(this, missingno);
			this.set(pokemon.id, pokemon);
			return pokemon;
		}
		try {
			const { body } = await request.get(`https://pokeapi.co/api/v2/pokemon-species/${query}/`);
			const pokemon = new Pokemon(this, body);
			this.set(pokemon.id, pokemon);
			return pokemon;
		} catch (err) {
			if (err.status === 404) return null;
			throw err;
		}
	}

	async fetchSmogonData(gen) {
		if (this.smogonData[gen.toLowerCase()]) return this.smogonData[gen.toLowerCase()];
		const { text } = await request.get(`https://www.smogon.com/dex/${gen}/pokemon/`);
		this.smogonData[gen.toLowerCase()] = JSON.parse(text.match(/dexSettings = ({.+})/i)[1])
			.injectRpcs[1][1]
			.pokemon
			.map(pkmn => ({ id: pkmn.oob.dex_number, formats: pkmn.formats }));
		return this.smogonData[gen.toLowerCase()];
	}

	makeSlug(query) {
		return encodeURIComponent(query.toLowerCase().replaceAll(' ', '-').replace(/[^a-zA-Z0-9-]/g, ''));
	}
};
