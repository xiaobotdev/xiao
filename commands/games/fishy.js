const Command = require('../../structures/Command');
const fishes = ['🐟', '🐠', '🐡', '🔧'];

module.exports = class FishyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fishy',
			aliases: ['fish'],
			group: 'games',
			memberName: 'fishy',
			description: 'Catches a fish.'
		});
	}

	run(msg) {
		const fish = fishes[Math.floor(Math.random() * fishes.length)];
		return msg.say(`You caught a: ${fish}`);
	}
};
