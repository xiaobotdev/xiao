const request = require('node-superfetch');
const { removeDuplicates, firstUpperCase } = require('../../util/Util');
const missingno = require('../../assets/json/missingno');

module.exports = class Pokemon {
	constructor(data) {
		this.id = data.id;
		this.name = data.names.find(entry => entry.language.name === 'en').name;
		this.entries = removeDuplicates(data.flavor_text_entries
			.filter(entry => entry.language.name === 'en')
			.map(entry => entry.flavor_text.replace(/\n|\f|\r/g, ' ')));
		this.names = data.names.map(entry => ({ name: entry.name, language: entry.language.name }));
		this.genus = `The ${data.genera.filter(entry => entry.language.name === 'en')[0].genus}`;
		this.varieties = data.varieties.map(variety => {
			const name = firstUpperCase(variety.pokemon.name.replace(new RegExp(`${this.slug}-?`, 'i'), ''));
			return {
				id: variety.pokemon.name,
				name: name || null,
				default: variety.is_default,
				display: null,
				types: []
			};
		});
		this.typesCached = false;
		this.missingno = data.missingno || false;
	}

	get displayID() {
		return this.id.toString().padStart(3, '0');
	}

	get slug() {
		return encodeURIComponent(this.name.toLowerCase().replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/g, ''));
	}

	get spriteImageURL() {
		if (this.missingno) return missingno.sprite;
		return `https://www.serebii.net/sunmoon/pokemon/${this.displayID}.png`;
	}

	get boxImageURL() {
		if (this.missingno) return missingno.box;
		return `https://www.serebii.net/pokedex-sm/icon/${this.displayID}.png`;
	}

	get serebiiURL() {
		if (this.missingno) return missingno.url;
		return `https://www.serebii.net/pokedex-sm/${this.displayID}.shtml`;
	}

	async fetchTypes() {
		if (this.typesCached) return this;
		if (this.missingno) {
			this.varieties[0].types.push(...missingno.types);
		} else {
			const defaultVariety = this.varieties.find(variety => variety.default);
			const { body: defaultBody } = await request.get(`https://pokeapi.co/api/v2/pokemon/${defaultVariety.id}`);
			defaultVariety.types.push(...defaultBody.types.map(type => firstUpperCase(type.type.name)));
			defaultVariety.display = true;
			for (const variety of this.varieties) {
				if (variety.id === defaultVariety.id) continue;
				const { body } = await request.get(`https://pokeapi.co/api/v2/pokemon/${variety.id}`);
				variety.types.push(...body.types.map(type => firstUpperCase(type.type.name)));
				if (variety.types[0] === defaultVariety.types[0] && variety.types[1] === defaultVariety.types[1]) {
					variety.display = false;
				} else {
					variety.display = true;
				}
			}
		}
		this.typesCached = true;
		return this;
	}
};
