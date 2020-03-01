const { CommandoClient } = require('discord.js-commando');
const { WebhookClient } = require('discord.js');
const Collection = require('@discordjs/collection');
const winston = require('winston');
const PokemonStore = require('./pokemon/PokemonStore');
const MemePoster = require('./MemePoster');
const { XIAO_WEBHOOK_ID, XIAO_WEBHOOK_TOKEN } = process.env;

module.exports = class XiaoClient extends CommandoClient {
	constructor(options) {
		super(options);

		this.logger = winston.createLogger({
			transports: [new winston.transports.Console()],
			format: winston.format.combine(
				winston.format.timestamp({ format: 'MM/DD/YYYY HH:mm:ss' }),
				winston.format.printf(log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`)
			)
		});
		this.webhook = new WebhookClient(XIAO_WEBHOOK_ID, XIAO_WEBHOOK_TOKEN, { disableEveryone: true });
		this.pokemon = new PokemonStore();
		this.memePoster = new MemePoster(this);
		this.games = new Collection();
		this.phone = new Collection();
	}
};
