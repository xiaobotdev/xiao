const { removeDuplicates } = require('../../util/Util');

module.exports = class Pokemon {
	constructor(data) {
		this.id = data.id;
		this.name = data.names.find(entry => entry.language.name === 'en').name;
		this.entries = removeDuplicates(data.flavor_text_entries
			.filter(entry => entry.language.name === 'en')
			.map(entry => entry.flavor_text.replace(/\n|\f|\r/g, ' ')));
		this.names = data.names.map(entry => ({ name: entry.name, language: entry.language.name }));
		this.genus = `The ${data.genera.filter(entry => entry.language.name === 'en')[0].genus}`;
		this.missingno = data.missingno || false;
	}

	get displayID() {
		return this.id.toString().padStart(3, '0');
	}

	get slug() {
		return encodeURIComponent(this.name.toLowerCase().replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/g, ''));
	}

	get spriteImageURL() {
		if (this.missingno) return 'https://cdn.bulbagarden.net/upload/9/98/Missingno_RB.png';
		return `https://www.serebii.net/sunmoon/pokemon/${this.displayID}.png`;
	}

	get boxImageURL() {
		if (this.missingno) return 'https://cdn.bulbagarden.net/upload/1/1f/AniMS_Missingno_I.png';
		return `https://www.serebii.net/pokedex-sm/icon/${this.displayID}.png`;
	}

	get serebiiURL() {
		if (this.missingno) return 'https://bulbapedia.bulbagarden.net/wiki/MissingNo.';
		return `https://www.serebii.net/pokedex-sm/${this.displayID}.shtml`;
	}
};
