const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { formatNumber } = require('../../util/Util');

module.exports = class CurrencyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'currency',
			group: 'number-edit',
			memberName: 'currency',
			description: 'Converts currency from one currency to another.',
			credit: [
				{
					name: 'Foreign exchange rates API',
					url: 'https://exchangeratesapi.io/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'amount',
					prompt: 'How much currency should be converted? Do not use symbols.',
					type: 'float'
				},
				{
					key: 'base',
					prompt: 'What currency code (e.g. USD) do you want to use as the base?',
					type: 'string',
					min: 3,
					max: 3,
					parse: base => base.toUpperCase()
				},
				{
					key: 'target',
					prompt: 'What currency code (e.g. USD) do you want to convert to?',
					type: 'string',
					min: 3,
					max: 3,
					parse: target => target.toUpperCase()
				}
			]
		});

		this.rates = new Map();
	}

	async run(msg, { base, target, amount }) {
		if (base === target) return msg.say(`Converting ${base} to ${target} is the same value, dummy.`);
		try {
			const rate = await this.fetchRate(base, target);
			return msg.say(`${formatNumber(amount)} ${base} is ${formatNumber(amount * rate)} ${target}.`);
		} catch (err) {
			if (err.status === 400) return msg.say('Invalid base/target.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchRate(base, target) {
		const query = `${base}-${target}`;
		if (this.rates.has(query)) return this.rates.get(query);
		const { body } = await request
			.get('https://api.exchangeratesapi.io/latest')
			.query({
				base,
				symbols: target
			});
		this.rates.set(query, body.rates[target]);
		setTimeout(() => this.rates.delete(query), 1.8e+6);
		return body.rates[target];
	}
};
