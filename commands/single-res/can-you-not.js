const { Command } = require('discord.js-commando');

module.exports = class CanYouNotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'can-you-not',
			group: 'single-res',
			memberName: 'can-you-not',
			description: 'Can YOU not?'
		});
	}

	run(msg) {
		return msg.say('Can YOU not?');
	}
};
