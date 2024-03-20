const ArgumentType = require('../ArgumentType');
const emojiRegex = require('emoji-regex');

module.exports = class DefaultEmojiArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'default-emoji');
		this.regex = new RegExp(`^(?:${emojiRegex().toString()})$`);
	}

	validate(value) {
		if (!this.regex.test(value)) return false;
		return true;
	}

	parse(value) {
		return value;
	}
};
