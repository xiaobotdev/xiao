const { ArgumentType, util: { disambiguation } } = require('discord.js-commando');
const { escapeMarkdown } = require('discord.js');

class EmojiArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'emoji');
	}

	validate(value, msg) {
		const matches = value.match(/^(?:<a?:([a-zA-Z0-9_]+):)?([0-9]+)>?$/);
		if (matches && msg.client.emojis.has(matches[2])) return true;
		if (!msg.guild) return false;
		const search = value.toLowerCase();
		let emojis = msg.guild.emojis.filterArray(nameFilterInexact(search));
		if (!emojis.length) return false;
		if (emojis.length === 1) return true;
		const exactEmojis = emojis.filter(nameFilterExact(search));
		if (exactEmojis.length === 1) return true;
		if (exactEmojis.length > 0) emojis = exactEmojis;
		return emojis.length <= 15
			? `${disambiguation(emojis.map(emoji => escapeMarkdown(emoji.name)), 'emojis', null)}\n`
			: 'Multiple emojis found. Please be more specific.';
	}

	parse(value, msg) {
		const matches = value.match(/^(?:<a?:([a-zA-Z0-9_]+):)?([0-9]+)>?$/);
		if (matches) return msg.client.emojis.get(matches[2]) || null;
		const search = value.toLowerCase();
		const emojis = msg.guild.emojis.filterArray(nameFilterInexact(search));
		if (!emojis.length) return null;
		if (emojis.length === 1) return emojis[0];
		const exactEmojis = emojis.filterArray(nameFilterExact(search));
		if (exactEmojis.length === 1) return exactEmojis[0];
		return null;
	}
}

function nameFilterExact(search) {
	return thing => thing.name.toLowerCase() === search;
}

function nameFilterInexact(search) {
	return thing => thing.name.toLowerCase().includes(search);
}

module.exports = EmojiArgumentType;
