const { Command } = require('discord.js-commando');

class XiaoCommand extends Command {
	constructor(client) {
		this.argsPromptLimit = 1;
		this.argsSingleQuotes = false;
	}
}

module.exports = XiaoCommand;
