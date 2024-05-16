const ArgumentType = require('../ArgumentType');

module.exports = class CustomEmojiArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'custom-emoji');
	}

	validate(value, msg) {
		const matches = value.match(/^(?:<a?:([a-zA-Z0-9_]+):)?([0-9]+)>?$/);
		if (matches && msg.client.emojis.cache.has(matches[2])) return true;
		if (!msg.guild) return false;
		const search = value.toLowerCase();
		const emojis = msg.guild.emojis.cache.filter(nameFilterInexact(search));
		if (!emojis.size) return false;
		if (emojis.size === 1) return true;
		const exactEmojis = emojis.filter(nameFilterExact(search));
		if (exactEmojis.size === 1) return true;
		return false;
	}

	parse(value, msg) {
		const matches = value.match(/^(?:<a?:([a-zA-Z0-9_]+):)?([0-9]+)>?$/);
		if (matches) return msg.client.emojis.cache.get(matches[2]) || null;
		const search = value.toLowerCase();
		const emojis = msg.guild.emojis.cache.filter(nameFilterInexact(search));
		if (!emojis.size) return null;
		if (emojis.size === 1) return emojis.first();
		const exactEmojis = emojis.filter(nameFilterExact(search));
		if (exactEmojis.size === 1) return exactEmojis.first();
		return null;
	}

	example(msg) {
		if (msg.guild && msg.guild.emojis.cache.size) return msg.guild.emojis.cache.random().toString();
		return this.client.emojis.cache.random().toString();
	}
};

function nameFilterExact(search) {
	return emoji => emoji.name.toLowerCase() === search;
}

function nameFilterInexact(search) {
	return emoji => emoji.name.toLowerCase().includes(search);
}
