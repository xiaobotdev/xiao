const Command = require('../../structures/Command');
const { randomRange, formatNumber } = require('../../util/Util');

module.exports = class RollCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'roll',
			aliases: ['dice'],
			group: 'random-res',
			memberName: 'roll',
			description: 'Rolls a dice with a minimum/maximum value of your choice.',
			args: [
				{
					key: 'maxValue',
					label: 'highest number',
					prompt: 'What is the highest number you wish to appear?',
					type: 'integer',
					default: 6,
					min: 1,
					max: Number.MAX_SAFE_INTEGER
				},
				{
					key: 'minValue',
					label: 'lowest number',
					prompt: 'What is the lowest number you wish to appear?',
					type: 'integer',
					default: 0,
					min: 0,
					max: Number.MAX_SAFE_INTEGER
				}
			]
		});
	}

	run(msg, { maxValue, minValue }) {
		let result;
		if (!minValue) result = Math.floor(Math.random() * maxValue) + 1;
		else result = randomRange(minValue, maxValue);
		return msg.say(`You rolled a ${formatNumber(result)}.`);
	}
};
