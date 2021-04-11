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
		const drawn = [];
		for (let i = 0; i < amount; i++) {
			const card = this.deck[0];
			this.deck.shift();
			drawn.push(card);
		}
		return amount === 1 ? drawn[0] : drawn;
	}

	reset() {
		this.makeCards();
		return this;
	}
};
