const Command = require('../../framework/Command');

module.exports = class CanYouNotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'can-you-not',
			aliases: ['can-u-not'],
			group: 'single',
			memberName: 'can-you-not',
			description: 'Can YOU not?'
		});
	}

	run(msg) {
		return msg.say('Can YOU not?');
	}
};
