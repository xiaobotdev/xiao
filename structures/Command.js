const { Command } = require('discord.js-commando');

class XiaoCommand extends Command {
	constructor(client, info) {
		super(client, info);

		this.argsPromptLimit = info.argsPromptLimit || 1;
		this.argsSingleQuotes = info.argsSingleQuotes || false;
		this.throttling = info.throttling || { usages: 1, duration: 2 };
	}
}

module.exports = XiaoCommand;
