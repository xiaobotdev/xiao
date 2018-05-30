const Command = require('../../structures/Command');
const math = require('mathjs');

module.exports = class UnitsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'units',
			aliases: ['convert-units', 'unit-converter', 'unit'],
			group: 'number-edit',
			memberName: 'units',
			description: 'Converts units to/from other units.',
			args: [
				{
					key: 'amount',
					prompt: 'How many units should be converted?',
					type: 'float'
				},
				{
					key: 'base',
					prompt: 'What unit type do you want to convert from?',
					type: 'string',
					parse: base => base.toLowerCase()
				},
				{
					key: 'target',
					prompt: 'What unit type do you want to convert to?',
					type: 'string',
					parse: target => target.toLowerCase()
				}
			]
		});
	}

	run(msg, { base, target, amount }) {
		try {
			const value = math.unit(amount, base).toNumber(target);
			return msg.say(`${amount} ${base} is ${value} ${target}.`);
		} catch (err) {
			return msg.say('Either an invalid unit type was provided or the unit types do not match.');
		}
	}
};
