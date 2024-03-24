const Command = require('../../framework/Command');
const dotenv = require('dotenv');

module.exports = class UpdateEnvCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'update-env',
			aliases: ['dotenv', 'update-process-env'],
			group: 'util',
			memberName: 'update-env',
			description: 'Updates the bot\'s environment variables.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true
		});
	}

	run(msg) {
		dotenv.config();
		return msg.say('Updated environment variables.');
	}
};
