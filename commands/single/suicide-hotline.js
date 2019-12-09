const Command = require('../../structures/Command');

module.exports = class SuicideHotlineCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'suicide-hotline',
			aliases: ['kms', 'kill-myself'],
			group: 'single',
			memberName: 'suicide-hotline',
			description: 'Responds with the phone number for the Suicide Hotline.',
			patterns: [/kms|(kill myself)/i]
		});
	}

	run(msg) {
		return msg.say('Don\'t say that. Get help. Call 1-800-273-8255 for the National Suicide Prevention Lifeline.');
	}
};
