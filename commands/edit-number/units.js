const Command = require('../../framework/Command');
const math = require('mathjs');
const { stripIndents } = require('common-tags');
const { formatNumber } = require('../../util/Util');

module.exports = class UnitsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'units',
			aliases: ['convert'],
			group: 'edit-number',
			description: 'Converts units to/from other units.',
			details: '**Units:** <https://mathjs.org/docs/datatypes/units.html#reference>',
			args: [
				{
					key: 'amount',
					type: 'float'
				},
				{
					key: 'base',
					type: 'string',
					parse: base => base.toLowerCase()
				},
				{
					key: 'target',
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
			return msg.say(stripIndents`
				Either an invalid unit type was provided or the unit types do not match.
				For a list of units, see <https://mathjs.org/docs/datatypes/units.html#reference>.
			`);
		}
	}
};
