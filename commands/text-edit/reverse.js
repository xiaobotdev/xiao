const Command = require('../../structures/Command');

module.exports = class ReverseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reverse',
			group: 'text-edit',
			memberName: 'reverse',
			description: 'Reverses text.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to reverse?',
					type: 'string'
				}
			]
		});
	}

	run(msg, args) {
		const { text } = args;
		return msg.say(text.split('').reverse().join(''));
	}
};
