const TarotCard = require('./TarotCard');
const cards = require('../../assets/json/tarot');
const { shuffle } = require('../../util/Util');

module.exports = class TarotDeck {
	constructor() {
		this.deck = [];
		this.makeCards();
	}

	makeCards() {
		const newDeck = [];
		for (const card of cards) {
			newDeck.push(new TarotCard(card));
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
		this.makeCards();
		return this;
	}
};
