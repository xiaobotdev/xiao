const { ArgumentType } = require('discord.js-commando');
const sherlock = require('sherlockjs');

module.exports = class SherlockType extends ArgumentType {
	constructor(client) {
		super(client, 'sherlock');
	}

	validate(value) {
		const time = sherlock.parse(value);
		if (!time.startDate) return `Please provide a valid starting time.`;
		return true;
	}

	parse(value) {
		return sherlock.parse(value);
	}
};
