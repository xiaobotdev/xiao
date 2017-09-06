const Command = require('../../structures/Command');

module.exports = class CanYouNotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'can-you-not',
			group: 'random',
			memberName: 'can-you-not',
			description: 'Can YOU not?'
		});
	}

	run(msg) {
		return msg.say('Can YOU not?');
	}
};
