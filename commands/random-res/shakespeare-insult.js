const Command = require('../../framework/Command');
const insults = require('../../assets/json/shakespeare-insult');

module.exports = class ShakespeareInsultCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shakespeare-insult',
			aliases: ['shakespeare', 'shakespeare-insulter'],
			group: 'random-res',
			description: 'Lets Shakespeare insult you.'
		});
	}

	run(msg) {
		const first = insults[0][Math.floor(Math.random() * insults[0].length)];
		const second = insults[1][Math.floor(Math.random() * insults[1].length)];
		const third = insults[2][Math.floor(Math.random() * insults[2].length)];
		return msg.reply(`Thou ${first} ${second} ${third}.`);
	}
};
