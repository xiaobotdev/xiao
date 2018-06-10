const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class CurrencyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'currency',
			aliases: ['currency-convert', 'convert-currency'],
			group: 'number-edit',
			memberName: 'currency',
			description: 'Converts money from one currency to another.',
			args: [
				{
					key: 'amount',
					prompt: 'How much money should be converted? Do not use symbols.',
					type: 'float'
				},
				{
					key: 'base',
					prompt: 'What currency code do you want to use as the base?',
					type: 'string',
					parse: base => base.toUpperCase()
				},
				{
					key: 'target',
					prompt: 'What currency code do you want to convert to?',
					type: 'string',
					parse: target => target.toUpperCase()
				}
			]
		});

		this.currencies = null;
		this.rates = new Map();
	}

	async run(msg, { base, target, amount }) {
		try {
			if (!this.currencies) await this.fetchCurrencies();
			base = this.currencies[base] || this.currencies.find($ => $.currencyName.toLowerCase() === base);
			if (!base) return msg.say('Invalid base.');
			target = this.currencies[target] || this.currencies.find($ => $.currencyName.toLowerCase() === target);
			if (!target) return msg.say('Invalid target.');
			if (base.id === target.id) return msg.say(`Converting ${base.id} to ${target.id} is the same value, dummy.`);
			const rate = await this.fetchRate(base, target);
			return msg.say(`${amount} ${base.id} is ${amount * rate} ${target.id}.`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchCurrencies() {
		const { body } = await request.get('https://free.currencyconverterapi.com/api/v5/currencies');
		this.currencies = body.results;
		return body.results;
	}

	async fetchRate(base, target) {
		const query = `${base.id}_${target.id}`;
		if (this.rates.has(query)) return this.rates.get(query);
		const { body } = await request
			.get('https://free.currencyconverterapi.com/api/v5/convert')
			.query({
				q: query,
				compact: 'ultra'
			});
		this.rates.set(query, body[query]);
		setTimeout(() => this.rates.delete(query), 1.8e+6);
		return body[query];
	}
};
