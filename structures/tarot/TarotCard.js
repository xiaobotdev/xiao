const path = require('path');

module.exports = class TarotCard {
	constructor(data) {
		this.rank = data.rank;
		this.suit = data.suit;
		this.name = data.name;
		this.meanings = data.meanings;
		this.keywords = data.keywords;
		this.fortunes = data.fortune_telling;
	}

	get imagePath() {
		return path.join(__dirname, '..', '..', 'assets', 'images', 'tarot', this.suit, `${this.rank}.jpg`);
	}

	randomLightMeaning() {
		return this.meanings.light[Math.floor(Math.random() * this.meanings.light.length)];
	}

	randomShadowMeaning() {
		return this.meanings.shadow[Math.floor(Math.random() * this.meanings.shadow.length)];
	}
};
