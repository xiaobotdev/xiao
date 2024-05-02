const { Collection } = require('@discordjs/collection');
const fs = require('fs');
const path = require('path');
const fontFinder = require('font-finder');
const Font = require('./Font');

module.exports = class FontManager extends Collection {
	constructor(client, options) {
		super(options);

		Object.defineProperty(this, 'client', { value: client });
	}

	async registerFontsIn(filepath) {
		const files = fs.readdirSync(filepath);
		for (const file of files) {
			const metadata = await fontFinder.get(path.join(filepath, file));
			const font = new Font(path.join(filepath, file), file, metadata);
			this.set(file, font);
			font.register();
		}
		return this;
	}
};
