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
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(text.toLowerCase());
	}
};
