const Command = require('../../framework/Command');

module.exports = class RepeatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'repeat',
			group: 'edit-text',
			memberName: 'repeat',
			description: 'Repeat text over and over and over and over (etc).',
			args: [
				{
					key: 'amount',
					type: 'integer',
					min: 1,
					max: 2000
				},
				{
					key: 'text',
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
