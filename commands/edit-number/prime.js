const Command = require('../../framework/Command');
const { formatNumber } = require('../../util/Util');

module.exports = class PrimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'prime',
			aliases: ['is-prime'],
			group: 'edit-number',
			description: 'Determines if a number is a prime number.',
			args: [
				{
					key: 'number',
					type: 'integer',
					max: Number.MAX_SAFE_INTEGER
				}
			]
		});
	}

	run(msg, { number }) {
		return msg.reply(`${formatNumber(number)} is${this.isPrime(number) ? '' : ' not'} a prime number.`);
	}

	isPrime(number) {
		if (number < 2) return false;
		const sqrt = Math.sqrt(number);
		for (let i = 2; i <= sqrt; i++) {
			if (number % i === 0) return false;
		}
		return true;
	}
};
