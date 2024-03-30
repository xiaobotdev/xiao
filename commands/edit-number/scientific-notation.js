const Command = require('../../framework/Command');

module.exports = class ScientificNotationCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'scientific-notation',
			aliases: ['science-notation', 'exponential-notation'],
			group: 'edit-number',
			memberName: 'scientific-notation',
			description: 'Converts a number to scientific notation.',
			args: [
				{
					key: 'number',
					type: 'float'
				}
			]
		});
	}

	run(msg, { number }) {
		return msg.reply(number.toExponential());
	}
};
