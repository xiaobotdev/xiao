const { ArgumentType, util: { disambiguation } } = require('discord.js-commando');
const { escapeMarkdown } = require('discord.js');

module.exports = class FontArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'font');
	}

	validate(value) {
		const choice = value.toLowerCase();
		let found = this.client.fonts.filter(font => {
			if (font.isVariant) return false;
			if (font.name.toLowerCase().includes(choice)) return true;
			if (font.filenameNoExt.toLowerCase().includes(choice)) return true;
			return false;
		});
		if (found.size === 0) return false;
		if (found.size === 1) return true;
		const foundExact = found.filter(font => {
			if (font.name.toLowerCase() === choice) return true;
			if (font.filenameNoExt.toLowerCase() === choice) return true;
			return false;
		});
		if (foundExact.size === 1) return true;
		if (foundExact.size > 0) found = foundExact;
		return found.size <= 15 ?
			`${disambiguation(found.map(font => escapeMarkdown(font.name)), 'fonts', null)}\n` :
			'Multiple fonts found. Please be more specific.';
	}

	parse(value) {
		const choice = value.toLowerCase();
		let found = this.client.fonts.filter(font => {
			if (font.name.toLowerCase().includes(choice)) return true;
			if (font.filenameNoExt.toLowerCase().includes(choice)) return true;
			return true;
		});
		if (found.size === 0) return null;
		if (found.size === 1) return found.first();
		const foundExact = found.filter(font => {
			if (font.name.toLowerCase() === choice) return true;
			if (font.filenameNoExt.toLowerCase() === choice) return true;
			return true;
		});
		if (foundExact.size === 1) return foundExact.first();
		return null;
	}
};
