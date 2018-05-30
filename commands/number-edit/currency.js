const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const { list } = require('../../util/Util');
const codes = require('../../assets/json/currency');

module.exports = class CurrencyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'currency',
			aliases: ['currency-convert', 'convert-currency'],
			group: 'number-edit',
			memberName: 'currency',
			description: 'Converts money from one currency to another.',
			details: `**Codes**: ${codes.join(', ')}`,
			args: [
				{
					key: 'amount',
					prompt: 'How much money should be converted? Do not use symbols.',
					type: 'float'
				},
				{
					key: 'base',
					prompt: `What currency code do you want to use as the base? Either ${list(codes, 'or')}.`,
					type: 'string',
					oneOf: codes,
					parse: base => base.toUpperCase()
				},
				{
					key: 'target',
					prompt: `What currency code do you want to convert to? Either ${list(codes, 'or')}.`,
					type: 'string',
					oneOf: codes,
					parse: target => target.toUpperCase()
				}
			]
		});
	}

	async run(msg, { base, target, amount }) {
		if (base === target) return msg.say(`Converting ${base} to ${target} is the same value, dummy.`);
		try {
			const { body } = await snekfetch
				.get('http://api.fixer.io/latest')
				.query({
					base,
					symbols: target
				});
			return msg.say(`${amount} ${base} is ${amount * body.rates[target]} ${target}.`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
