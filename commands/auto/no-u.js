const Command = require('../../structures/Command');

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

	run(msg) {
		return msg.say('no u');
	}
};
