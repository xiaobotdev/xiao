const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { formatNumber } = require('../../util/Util');

module.exports = class CurrencyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'currency',
			aliases: ['money-convert', 'convert-money'],
			group: 'edit-number',
			memberName: 'currency',
			description: 'Converts currency from one currency to another.',
			credit: [
				{
					name: 'Fawaz Ahmed',
					url: 'https://github.com/fawazahmed0',
					reason: 'API',
					reasonURL: 'https://github.com/fawazahmed0/exchange-api'
				}
			],
			args: [
				{
					key: 'amount',
					type: 'float'
				},
				{
					key: 'base',
					type: 'string',
					min: 3,
					max: 3
				},
				{
					key: 'target',
					type: 'string',
					min: 3,
					max: 3
				}
			]
		});

		this.currencies = null;
	}

	async run(msg, { base, target, amount }) {
		if (!this.currencies) await this.fetchCurrencies();
		if (!this.currencies[base]) return msg.say('You provided an invalid base currency code.');
		if (!this.currencies[target]) return msg.say('You provided an invalid target currency code.');
		if (base === target) return msg.say(`Converting ${base} to ${target} is the same value, dummy.`);
		const rate = await this.fetchRate(base, target);
		const baseName = this.currencies[base];
		const targetName = this.currencies[target];
		return msg.say(`${formatNumber(amount)} ${baseName} is ${formatNumber(amount * rate)} ${targetName}.`);
	}

	async fetchCurrencies() {
		const { body } = await request
			.get('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json');
		this.currencies = body;
		setTimeout(() => { this.currencies = null; }, 1.8e+6);
		return this.currencies;
	}

	async fetchRate(base, target) {
		const { body } = await request
			.get(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}/${target}.json`);
		return body[target];
	}
};
