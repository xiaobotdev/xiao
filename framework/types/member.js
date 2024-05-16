const ArgumentType = require('../ArgumentType');

module.exports = class MemberArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'member');
	}

	async validate(val, msg) {
		const matches = val.match(/^(?:<@!?)?([0-9]+)>?$/);
		if (matches) {
			try {
				const member = await msg.guild.members.fetch(await this.client.users.fetch(matches[1]));
				if (!member) return false;
				return true;
			} catch {
				return false;
			}
		}
		const search = val.toLowerCase();
		const members = msg.guild.members.cache.filter(memberFilterInexact(search));
		if (members.size === 0) return false;
		if (members.size === 1) return true;
		const exactMembers = members.filter(memberFilterExact(search));
		if (exactMembers.size === 1) return true;
		return false;
	}

	parse(val, msg) {
		const matches = val.match(/^(?:<@!?)?([0-9]+)>?$/);
		if (matches) return msg.guild.members.resolve(matches[1]) || null;
		const search = val.toLowerCase();
		const members = msg.guild.members.cache.filter(memberFilterInexact(search));
		if (members.size === 0) return null;
		if (members.size === 1) return members.first();
		const exactMembers = members.filter(memberFilterExact(search));
		if (exactMembers.size === 1) return exactMembers.first();
		return null;
	}

	example(msg) {
		if (msg.guild) return msg.guild.members.cache.random().tag;
		const members = [this.client.user, msg.channel.recipient];
		return members[Math.floor(Math.random() * members.length)].tag;
	}
};

function memberFilterExact(search) {
	return mem => mem.user.username.toLowerCase() === search
		|| (mem.nickname && mem.nickname.toLowerCase() === search)
		|| mem.tag.toLowerCase() === search;
}

function memberFilterInexact(search) {
	return mem => mem.user.username.toLowerCase().includes(search)
		|| (mem.nickname && mem.nickname.toLowerCase().includes(search))
		|| mem.tag.toLowerCase().includes(search);
}
