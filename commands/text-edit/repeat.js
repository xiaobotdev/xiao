const Command = require('../../structures/Command');

module.exports = class RepeatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'repeat',
			group: 'text-edit',
			memberName: 'repeat',
			description: 'Repeat text over and over and over and over (etc).',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to repeat over and over and over and over?',
					type: 'string',
					validate: text => {
						if (!text.includes('@everyone') && !text.includes('@here')) return true;
						return 'Invalid text, please do not repeat everyone or here mentions.';
					}
				}
			]
		});
	}

	run(msg, args) {
		const { text } = args;
		return msg.say(text.repeat(2000).substr(0, 2000));
	}
};
