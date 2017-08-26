const Command = require('../../structures/Command');
const { list } = require('../../structures/Util');
const units = ['celsius', 'fahrenheit', 'kelvin'];

module.exports = class TemperatureCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'temperature',
			group: 'num-edit',
			memberName: 'temperature',
			description: `Converts temperatures to/from ${list(units, 'or')}.`,
			args: [
				{
					key: 'base',
					prompt: `What temperature unit do you want to use as the base? Either ${list(units, 'or')}.`,
					type: 'string',
					validate: base => {
						if (units.includes(base.toLowerCase())) return true;
						return `Invalid base, please enter either ${list(units, 'or')}.`;
					},
					parse: base => base.toLowerCase()
				},
				{
					key: 'target',
					prompt: `What temperature unit do you want to convert to? Either ${list(units, 'or')}.`,
					type: 'string',
					validate: target => {
						if (units.includes(target.toLowerCase())) return true;
						return `Invalid target, please enter either ${list(units, 'or')}.`;
					},
					parse: target => target.toLowerCase()
				},
				{
					key: 'amount',
					prompt: 'What temperature should be converted?',
					type: 'float'
				}
			]
		});
	}

	run(msg, args) { // eslint-disable-line consistent-return
		const { base, target, amount } = args;
		if (base === target) return msg.say(`Converting ${base} to ${target} is the same value, dummy.`);
		if (base === 'celsius') {
			if (target === 'fahrenheit') return msg.say(`${amount}°C is ${(amount * 1.8) + 32}°F.`);
			if (target === 'kelvin') return msg.say(`${amount}°C is ${amount + 273.15}°K.`);
		}
		if (base === 'fahrenheit') {
			if (target === 'celsius') return msg.say(`${amount}°F is ${(amount - 32) / 1.8}°C.`);
			if (target === 'kelvin') return msg.say(`${amount}°F is ${(amount + 459.67) * (5 / 9)}°K.`);
		}
		if (base === 'kelvin') {
			if (target === 'celsius') return msg.say(`${amount}°K is ${amount - 273.15}°C.`);
			if (target === 'fahrenheit') return msg.say(`${amount}°K is ${(amount * 1.8) - 459.67}°F.`);
		}
	}
};
