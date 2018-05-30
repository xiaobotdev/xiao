const { Command } = require('discord.js-commando');

class XiaoCommand extends Command {
	constructor(client) {
		super(client, {
			argsPromptLimit: 1,
			argsSingleQuotes: false
		});
	}
}

module.exports = XiaoCommand;
