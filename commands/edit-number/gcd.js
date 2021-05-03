const Command = require('../../structures/Command');
const { gcd } = require('../../util/Util');

module.exports = class GcdCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gcd',
			aliases: ['greatest-common-denominator'],
			group: 'edit-number',
			memberName: 'gcd',
			description: 'Determines two numbers\' greatest common denominator.',
			args: [
				{
					key: 'number1',
					label: 'first number',
					prompt: 'What is the first number you want to check?',
					type: 'integer',
					max: Number.MAX_SAFE_INTEGER,
					min: 1
				},
				{
					key: 'number2',
					label: 'second number',
					prompt: 'What is the second number you want to check?',
					type: 'integer',
					max: Number.MAX_SAFE_INTEGER,
					min: 1
				}
			]
		});
	}

	run(msg, { number1, number2 }) {
		return msg.reply(gcd(number1, number2));
	}
};
