const Command = require('../../structures/commands/AutoReply');

module.exports = class CanYouNotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'can-you-not',
			aliases: ['can-u-not'],
			group: 'auto',
			memberName: 'can-you-not',
			description: 'Can YOU not?',
			patterns: [/^(can (you|u) not\??)$/i]
		});
	}

	generateText() {
		return 'Can YOU not?';
	}
};
