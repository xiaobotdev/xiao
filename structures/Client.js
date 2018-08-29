const { CommandoClient } = require('discord.js-commando');
const { WebhookClient } = require('discord.js');
const PokemonStore = require('./PokemonStore');
const { XIAO_WEBHOOK_ID, XIAO_WEBHOOK_TOKEN } = process.env;

module.exports = class XiaoClient extends CommandoClient {
	constructor(options) {
		super(options);

		this.webhook = new WebhookClient(XIAO_WEBHOOK_ID, XIAO_WEBHOOK_TOKEN, { disableEveryone: true });
		this.pokemon = new PokemonStore();
	}
};
