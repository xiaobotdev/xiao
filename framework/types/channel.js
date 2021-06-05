const ArgumentType = require('../ArgumentType');

module.exports = class ChannelArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'channel');
	}

	validate(val, msg) {
		const matches = val.match(/^(?:<#)?([0-9]+)>?$/);
		if (matches) return msg.guild.channels.cache.has(matches[1]);
		const search = val.toLowerCase();
		const channels = msg.guild.channels.cache.filter(nameFilterInexact(search));
		if (channels.size === 0) return false;
		if (channels.size === 1) return true;
		const exactChannels = channels.filter(nameFilterExact(search));
		if (exactChannels.size === 1) return true;
		return false;
	}

	parse(val, msg) {
		const matches = val.match(/^(?:<#)?([0-9]+)>?$/);
		if (matches) return msg.guild.channels.cache.get(matches[1]) || null;
		const search = val.toLowerCase();
		const channels = msg.guild.channels.cache.filter(nameFilterInexact(search));
		if (channels.size === 0) return null;
		if (channels.size === 1) return channels.first();
		const exactChannels = channels.filter(nameFilterExact(search));
		if (exactChannels.size === 1) return exactChannels.first();
		return null;
	}
};

function nameFilterExact(search) {
	return thing => thing.name.toLowerCase() === search;
}

function nameFilterInexact(search) {
	return thing => thing.name.toLowerCase().includes(search);
}
