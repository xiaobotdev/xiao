const Command = require('../../structures/Command');
const crypto = require('crypto');

module.exports = class SecurityKeyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'security-key',
			aliases: ['crypto', 'random-bytes'],
			group: 'random',
			memberName: 'security-key',
			description: 'Responds with a random security key.'
		});
	}

	run(msg) {
		return msg.say(crypto.randomBytes(15).toString('hex'));
	}
};
