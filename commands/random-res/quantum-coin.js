const { Command } = require('discord.js-commando');
const sides = ['on NaN', 'on 0', 'in the air', 'on null', 'on undefined', 'on \'\''];

module.exports = class QuantumCoinCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'quantum-coin',
			aliases: ['q-coin'],
			group: 'random-res',
			memberName: 'quantum-coin',
			description: 'Flips a coin that lands on some form of nothing.'
		});
	}

	run(msg) {
		return msg.say(`It landed ${sides[Math.floor(Math.random() * sides.length)]}.`);
	}
};
