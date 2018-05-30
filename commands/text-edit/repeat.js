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
					key: 'amount',
					prompt: 'How many times do you want to repeat your text?',
					type: 'integer',
					min: 1,
					max: 2000
				},
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

	run(msg, { amount, text }) {
		return msg.say(text.repeat(amount).substr(0, 2000));
	}
};
