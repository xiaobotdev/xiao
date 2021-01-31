const { firstUpperCase } = require('../../util/Util');

module.exports = class Move {
	constructor(store, data) {
		this.store = store;
		this.id = data.id;
		const slugName = firstUpperCase(data.name).replaceAll('-', ' ');
		this.name = data.names.length
			? data.names.find(entry => entry.language.name === 'en').name
			: slugName;
		this.description = data.effect_entries.length
			? data.effect_entries.find(entry => entry.language.name === 'en').effect
			: data.flavor_text_entries.length
				? data.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text
				: null;
		this.accuracy = data.accuracy;
		this.effectChance = data.effect_chance;
		this.power = data.power;
		this.pp = data.pp;
		this.type = firstUpperCase(data.type.name);
		this.contestType = data.contest_type ? firstUpperCase(data.contest_type.name) : null;
		this.class = firstUpperCase(data.damage_class.name);
	}

	get cleanDescription() {
		return this.description
			.replace(/\$effect_chance/gi, this.effectChance);
	}

	get slug() {
		return this.store.makeSlug(this.name);
	}
};
