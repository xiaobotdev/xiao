const ArgumentType = require('../ArgumentType');
const emojiRegex = require('emoji-regex')();

module.exports = class DefaultEmojiArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'default-emoji');
	}

	validate(value) {
		value += value;
		return emojiRegex.test(value);
	}

	parse(value) {
		return value.match(emojiRegex)[0];
	}
};
