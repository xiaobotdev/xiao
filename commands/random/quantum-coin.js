const Command = require('../../structures/Command');
const sides = [NaN, 0, null, undefined, ''];

module.exports = class QuantumCoinCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'quantum-coin',
			aliases: ['q-coin'],
			group: 'random',
			memberName: 'quantum-coin',
			description: 'Flips a coin that lands on some form of nothing.'
		});
	}

	run(msg) {
		return msg.say(`It landed on ${sides[Math.floor(Math.random() * sides.length)]}.`);
	}
};
