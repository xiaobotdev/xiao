const Command = require('../../structures/Command');

class XiaoCommand extends Command {
	constructor(client) {
		super(client, {
			argsPromptLimit: 1,
			argsSingleQuotes: false
		});
	}
}

module.exports = XiaoCommand;
