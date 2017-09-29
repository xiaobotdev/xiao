const { Command } = require('discord.js-commando');
const fishes = require('../../assets/json/fishy');

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
		const fish = Math.floor(Math.random() * 10) + 1;
		let rarity;
		if (fish < 5) rarity = 'junk';
		else if (fish < 8) rarity = 'common';
		else if (fish < 10) rarity = 'uncommon';
		else rarity = 'rare';
		const worth = Math.floor(Math.random() * (fishes[rarity].max - fishes[rarity].min + 1)) + fishes[rarity].min;
		return msg.say(`You caught a ${fishes[rarity].symbol}. I bet it'd sell for around $${worth}.`);
	}
};
