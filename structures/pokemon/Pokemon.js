module.exports = class Pokemon {
	constructor(data) {
		this.id = data.id;
		this.name = data.names.find(entry => entry.language.name === 'en').name;
		this.entries = data.flavor_text_entries
			.filter(entry => entry.language.name === 'en')
			.map(entry => entry.flavor_text.replace(/\n|\f|\r/g, ' '));
		this.names = data.names.map(entry => ({ name: entry.name, language: entry.language.name }));
		this.genus = `The ${data.genera.filter(entry => entry.language.name === 'en')[0].genus}`;
	}

	get displayID() {
		return this.id.toString().padStart(3, '0');
	}

	get slug() {
		return encodeURIComponent(this.name.toLowerCase().replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/g, ''));
	}

	get spriteImageURL() {
		return `https://www.serebii.net/sunmoon/pokemon/${this.displayID}.png`;
	}

	get boxImageURL() {
		return `https://www.serebii.net/pokedex-sm/icon/${this.displayID}.png`;
	}

	get serebiiURL() {
		return `https://www.serebii.net/pokedex-sm/${this.displayID}.shtml`;
	}
};
