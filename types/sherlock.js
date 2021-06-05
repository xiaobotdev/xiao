const Argument = require('../framework/ArgumentType');
const sherlock = require('sherlockjs');

module.exports = class SherlockType extends Argument {
	constructor(client) {
		super(client, 'sherlock');
	}

	validate(value) {
		const time = sherlock.parse(value);
		if (!time.startDate) return false;
		return true;
	}

	parse(value) {
		return sherlock.parse(value);
	}
};
