const Command = require('../../structures/Command');

module.exports = class NoUCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'no-u',
			aliases: ['no-you'],
			group: 'single',
			memberName: 'no-u',
			description: 'no u',
			patterns: [/no (you|u)/i]
		});
	}

	run(msg) {
		return msg.say('no u');
	}
};
