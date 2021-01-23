const { firstUpperCase } = require('../../util/Util');

module.exports = class Ability {
	constructor(store, data) {
		this.store = store;
		this.id = data.id;
		const slugName = firstUpperCase(data.name).replaceAll('-', ' ');
		this.name = data.names.length
			? data.names.find(entry => entry.language.name === 'en').name
			: slugName;
		this.description = data.effect_entries
			? data.effect_entries.find(entry => entry.language.name === 'en').effect
			: data.flavor_text_entries
				? data.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text
				: null;
	}
};
