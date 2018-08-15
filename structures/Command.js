const { Command } = require('discord.js-commando');

module.exports = class XiaoCommand extends Command {
	constructor(client, info) {
		super(client, info);

		this.argsSingleQuotes = info.argsSingleQuotes || false;
		this.throttling = info.throttling || { usages: 1, duration: 2 };
	}
};
