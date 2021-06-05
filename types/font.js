const Argument = require('../framework/ArgumentType');

module.exports = class FontArgument extends Argument {
	constructor(client) {
		super(client, 'font');
	}

	validate(value) {
		const choice = value.toLowerCase();
		const found = this.client.fonts.filter(font => {
			if (font.isFallback) return false;
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
		return false;
	}

	parse(value) {
		const choice = value.toLowerCase();
		const found = this.client.fonts.filter(font => {
			if (font.isFallback) return false;
			if (font.name.toLowerCase().includes(choice)) return true;
			if (font.filenameNoExt.toLowerCase().includes(choice)) return true;
			return false;
		});
		if (found.size === 0) return null;
		if (found.size === 1) return found.first();
		const foundExact = found.filter(font => {
			if (font.name.toLowerCase() === choice) return true;
			if (font.filenameNoExt.toLowerCase() === choice) return true;
			return false;
		});
		if (foundExact.size === 1) return foundExact.first();
		return null;
	}
};
