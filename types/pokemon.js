const { ArgumentType } = require('discord.js-commando');

module.exports = class PokemonArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'pokemon');
	}

	async validate(value) {
		const data = await this.client.pokemon.fetch(value);
		if (!data) return false;
		return true;
	}

	async parse(value) {
		return this.client.pokemon.fetch(value);
	}
};
