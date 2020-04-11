const Command = require('../../structures/commands/AutoReply');

module.exports = class NoUCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'no-u',
			aliases: ['no-you'],
			group: 'auto',
			memberName: 'no-u',
			description: 'no u',
			patterns: [/^n+o+ u+$/i]
		});
	}

	generateText() {
		return 'no u';
	}
};
