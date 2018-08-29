const { CommandoClient } = require('discord.js-commando');
const PokemonStore = require('./PokemonStore');

module.exports = class XiaoClient extends CommandoClient {
	constructor(options) {
		super(options);

		this.pokemon = new PokemonStore();
	}
};
