const ArgumentType = require('../ArgumentType');

module.exports = class UserArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'user');
	}

	async validate(val, msg) {
		const matches = val.match(/^(?:<@!?)?([0-9]+)>?$/);
		if (matches) {
			try {
				console.log(matches);
				const user = await msg.client.users.fetch(matches[1]);
				if (!user) return false;
				return true;
			} catch (err) {
				console.error(err);
				return false;
			}
		}
		if (!msg.guild) return false;
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
		if (matches) return msg.client.users.cache.get(matches[1]) || null;
		if (!msg.guild) return null;
		const search = val.toLowerCase();
		const members = msg.guild.members.cache.filter(memberFilterInexact(search));
		if (members.size === 0) return null;
		if (members.size === 1) return members.first().user;
		const exactMembers = members.filter(memberFilterExact(search));
		if (exactMembers.size === 1) return exactMembers.first().user;
		return null;
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
		|| mem.user.tag.toLowerCase().includes(search);
}
