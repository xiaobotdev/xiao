const ArgumentType = require('../ArgumentType');
const emojiRegex = require('emoji-regex')();

module.exports = class DefaultEmojiArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'default-emoji');
	}

	validate(value) {
		if (!emojiRegex.test(value)) return false;
		return true;
	}

	parse(value) {
		return value.match(emojiRegex)[0];
	}
};
