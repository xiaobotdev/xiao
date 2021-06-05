const Command = require('../../framework/Command');

module.exports = class UppercaseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'uppercase',
			aliases: ['to-uppercase', 'all-caps', 'caps'],
			group: 'edit-text',
			memberName: 'uppercase',
			description: 'Converts text to uppercase.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert to uppercase?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(text.toUpperCase());
	}
};
