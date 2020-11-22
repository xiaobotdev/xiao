const Card = require('./Card');
const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
const faces = ['Jack', 'Queen', 'King'];
const { shuffle } = require('../../util/Util');

module.exports = class Deck {
	constructor(options = {}) {
		this.deckCount = options.deckCount || 1;
		this.includeJokers = options.includeJokers || false;
		this.deck = [];
		this.makeCards(this.deckCount);
	}

	makeCards(deckCount) {
		const newDeck = [];
		for (let i = 0; i < deckCount; i++) {
			for (const suit of suits) {
				newDeck.push(new Card('Ace', suit));
				for (let j = 2; j <= 10; j++) newDeck.push(new Card(j, suit));
				for (const face of faces) newDeck.push(new Card(face, suit));
			}
			if (this.includeJokers) {
				newDeck.push(new Card('Joker', 'joker'));
				newDeck.push(new Card('Joker', 'joker'));
			}
		}
		this.deck = shuffle(newDeck);
		return this.deck;
	}

	draw(amount = 1) {
		const cards = [];
		for (let i = 0; i < amount; i++) {
			const card = this.deck[0];
			this.deck.shift();
			cards.push(card);
		}
		return amount === 1 ? cards[0] : cards;
	}

	reset() {
		this.makeCards(this.deckCount);
		return this;
	}
};
