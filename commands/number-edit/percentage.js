const { Command } = require('discord.js-commando');

module.exports = class PercentageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'percentage',
			aliases: ['percent'],
			group: 'number-edit',
			memberName: 'percentage',
			description: 'Determines the percentage one number is of another.',
			args: [
				{
					key: 'amount',
					prompt: 'How much of the maximum value should be used?',
					type: 'float'
				},
				{
					key: 'maximum',
					prompt: 'What is the maximum value of the percentage?',
					type: 'float'
				}
			]
		});
	}

	run(msg, { amount, maximum }) {
		const percentage = (amount / maximum) * 100;
		return msg.say(`${amount} is ${percentage}% of ${maximum}.`);
	}
};
