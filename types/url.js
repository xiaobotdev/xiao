const { ArgumentType } = require('discord.js-commando');
const { URL } = require('url');
const validURL = require('valid-url');

module.exports = class UrlType extends ArgumentType {
	constructor(client) {
		super(client, 'url');
	}

	validate(value) {
		return Boolean(validURL.isWebUri(value));
	}

	parse(value) {
		return new URL(value);
	}
};
