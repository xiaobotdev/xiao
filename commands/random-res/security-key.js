const { Command } = require('discord.js-commando');
const crypto = require('crypto');

module.exports = class SecurityKeyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'security-key',
			aliases: ['crypto', 'crypto-key'],
			group: 'random-res',
			memberName: 'security-key',
			description: 'Generates a random security key.'
		});
	}

	run(msg) {
		return msg.say(crypto.randomBytes(15).toString('hex'));
	}
};
