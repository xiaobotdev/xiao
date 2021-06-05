const Argument = require('../framework/ArgumentType');

module.exports = class PokemonArgument extends Argument {
	constructor(client) {
		super(client, 'pokemon');
	}

	async validate(value) {
		const data = await this.client.pokemon.fetch(value);
		if (!data) return false;
		return true;
	}

	parse(value) {
		return this.client.pokemon.fetch(value);
	}
};
