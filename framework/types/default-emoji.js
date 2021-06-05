const ArgumentType = require('../ArgumentType');
const emojiRegex = require('emoji-regex/RGI_Emoji.js');

module.exports = class DefaultEmojiArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'default-emoji');
		this.regex = new RegExp(`^(?:${emojiRegex().source})$`);
	}

	validate(value) {
		if (!this.regex.test(value)) return false;
		return true;
	}

	parse(value) {
		return value;
	}
};
