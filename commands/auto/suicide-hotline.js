const Command = require('../../structures/Command');

module.exports = class SuicideHotlineCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'suicide-hotline',
			aliases: ['kms', 'kill-myself'],
			group: 'auto',
			memberName: 'suicide-hotline',
			description: 'Responds with the phone number for the Suicide Hotline.',
			patterns: [/\bkms\b/i, /\b(kill myself)\b/i, /<:kms:(.+)>/i],
			credit: [
				{
					name: 'National Suicide Prevention Lifeline',
					url: 'https://suicidepreventionlifeline.org/',
					reason: 'Phone Number'
				}
			]
		});
	}

	run(msg) {
		return msg.say('Don\'t say that. Get help. Call 1-800-273-8255 for the National Suicide Prevention Lifeline.');
	}
};
