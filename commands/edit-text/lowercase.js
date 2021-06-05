const Command = require('../../framework/Command');

module.exports = class LowercaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lowercase',
			aliases: ['to-lowercase'],
			group: 'edit-text',
			memberName: 'lowercase',
			description: 'Converts text to lowercase.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert to lowercase?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(text.toLowerCase());
	}
};
