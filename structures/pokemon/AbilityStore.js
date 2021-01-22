const Collection = require('@discordjs/collection');
const request = require('node-superfetch');
const Ability = require('./Ability');

module.exports = class AbilityStore extends Collection {
	async fetch(query) {
		if (this.has(query)) return this.get(query);
		query = this.makeSlug(query.toString());
		if (!query) return null;
		const found = this.find(pokemon => pokemon.slug === query);
		if (found) return found;
		try {
			const { body } = await request.get(`https://pokeapi.co/api/v2/ability/${query}/`);
			const ability = new Ability(this, body);
			this.set(ability.id, ability);
			return ability;
		} catch (err) {
			if (err.status === 404) return null;
			throw err;
		}
	}

	makeSlug(query) {
		return encodeURIComponent(query.toLowerCase().replaceAll(' ', '-').replace(/[^a-zA-Z0-9-]/g, ''));
	}
};
