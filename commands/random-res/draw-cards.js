const Command = require('../../structures/Command');
const { shuffle } = require('../../util/Util');
const suits = ['♣', '♥', '♦', '♠'];
const faces = ['Jack', 'Queen', 'King'];

module.exports = class DrawCardsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'draw-cards',
			aliases: ['draw-hand'],
			group: 'random-res',
			memberName: 'draw-cards',
			description: 'Draws a random hand of playing cards.',
			args: [
				{
					key: 'amount',
					label: 'hand size',
					prompt: 'How many cards do you want to draw?',
					type: 'integer',
					max: 10,
					min: 1
				},
				{
					key: 'jokers',
					prompt: 'Do you want the deck to include jokers?',
					type: 'boolean',
					default: false
				}
			]
		});

		this.deck = null;
	}

	run(msg, { amount, jokers }) {
		if (!this.deck) this.deck = this.generateDeck();
		let cards = this.deck;
		if (!jokers) cards = cards.filter(card => !card.includes('Joker'));
		return msg.reply(`${amount === 1 ? '' : '\n'}${shuffle(cards).slice(0, amount).join('\n')}`);
	}

	generateDeck() {
		const deck = [];
		for (const suit of suits) {
			deck.push(`${suit} Ace`);
			for (let i = 2; i <= 10; i++) deck.push(`${suit} ${i}`);
			for (const face of faces) deck.push(`${suit} ${face}`);
		}
		deck.push('⭐ Joker');
		deck.push('⭐ Joker');
		return deck;
	}
};
