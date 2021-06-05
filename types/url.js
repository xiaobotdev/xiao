const Argument = require('../framework/ArgumentType');
const { URL } = require('url');
const validURL = require('valid-url');

module.exports = class UrlType extends Argument {
	constructor(client) {
		super(client, 'url');
	}

	validate(value) {
		return Boolean(validURL.isWebUri(value) || validURL.isWebUri(`http://${value}`));
	}

	parse(value) {
		if (!validURL.isWebUri(value)) return new URL(`http://${value}`);
		return new URL(value);
	}
};
