const Command = require('../../structures/Command');
const math = require('mathjs');
const { formatNumber } = require('../../util/Util');

module.exports = class UnitsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'units',
			aliases: ['convert'],
			group: 'number-edit',
			memberName: 'units',
			description: 'Converts units to/from other units.',
			credit: [
				{
					name: 'mathjs',
					url: 'https://mathjs.org/',
					reason: 'Expression Parser'
				}
			],
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
			return msg.say(`${formatNumber(amount)} ${base} is ${formatNumber(value)} ${target}.`);
		} catch {
			return msg.say('Either an invalid unit type was provided or the unit types do not match.');
		}
	}
};
