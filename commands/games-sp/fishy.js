const Command = require('../../structures/Command');
const { randomRange } = require('../../util/Util');
const fishes = require('../../assets/json/fishy');

module.exports = class FishyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fishy',
			aliases: ['fishing', 'fish'],
			group: 'games-sp',
			memberName: 'fishy',
			description: 'Go fishing.',
			credit: [
				{
					name: 'Tatsumaki',
					url: 'https://tatsumaki.xyz/',
					reason: 'Concept'
				}
			]
		});
	}

	run(msg) {
		const fishID = Math.floor(Math.random() * 10) + 1;
		let rarity;
		if (fishID < 5) rarity = 'junk';
		else if (fishID < 8) rarity = 'common';
		else if (fishID < 10) rarity = 'uncommon';
		else rarity = 'rare';
		const fish = fishes[rarity];
		const worth = randomRange(fish.min, fish.max);
		return msg.reply(`You caught a ${fish.symbol}. I bet it'd sell for around $${worth}.`);
	}
};
