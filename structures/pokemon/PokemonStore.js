const { Collection } = require('@discordjs/collection');
const request = require('node-superfetch');
const { loadImage } = require('@napi-rs/canvas');
const path = require('path');
const Pokemon = require('./Pokemon');
const MoveStore = require('./MoveStore');
const AbilityStore = require('./AbilityStore');
const ItemStore = require('./ItemStore');
const missingno = require('../../assets/json/missingno');

module.exports = class PokemonStore extends Collection {
	constructor(options) {
		super(options);

		this.pokemonCount = 1025;
		this.pokemonCountWithCry = 1025;
		this.smogonData = {};
		this.moves = new MoveStore();
		this.abilities = new AbilityStore();
		this.items = new ItemStore();
		this.sprites = null;
	}

	async loadSprites() {
		if (this.sprites) return this.sprites;
		const sprites = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'pokedex', 'sprites.png'));
		this.sprites = sprites;
		return this.sprites;
	}

	async fetch(query) {
		if (this.has(query)) return this.get(query);
		query = this.makeSlug(query.toString());
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
			.filter(pkmn => pkmn.oob)
			.map(pkmn => ({ id: pkmn.oob.dex_number, formats: pkmn.formats }));
		return this.smogonData[gen.toLowerCase()];
	}

	makeSlug(query) {
		return encodeURIComponent(query.toLowerCase().replaceAll(' ', '-').replace(/[^a-zA-Z0-9-]/g, ''));
	}
};
