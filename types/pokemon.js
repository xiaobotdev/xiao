const Argument = require('../framework/ArgumentType');
const examples = ['Pikachu', 'Bulbasaur', 'Victini', 'Flygon'];

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

	example() {
		if (this.client.pokemon.size) return this.client.pokemon.random().name;
		return examples[Math.floor(Math.random() * examples.length)];
	}
};
