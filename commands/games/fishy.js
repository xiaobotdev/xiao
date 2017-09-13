const Command = require('../../structures/Command');
const fishes = ['🐟', '🐠', '🐡', '🔧'];

module.exports = class FishyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fishy',
			aliases: ['fish', 'fishing'],
			group: 'games',
			memberName: 'fishy',
			description: 'Go fishing.'
		});
	}

	run(msg) {
		const fish = fishes[Math.floor(Math.random() * fishes.length)];
		if (fish === '🔧') return msg.say(`You caught a ${fish}... Too bad...`);
		return msg.say(`You caught a ${fish}!`);
	}
};
