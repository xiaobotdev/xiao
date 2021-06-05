const ArgumentType = require('../ArgumentType');

module.exports = class RoleArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'role');
	}

	validate(val, msg) {
		const matches = val.match(/^(?:<@&)?([0-9]+)>?$/);
		if (matches) return msg.guild.roles.cache.has(matches[1]);
		const search = val.toLowerCase();
		const roles = msg.guild.roles.cache.filter(nameFilterInexact(search));
		if (roles.size === 0) return false;
		if (roles.size === 1) return true;
		const exactRoles = roles.filter(nameFilterExact(search));
		if (exactRoles.size === 1) return true;
		return false;
	}

	parse(val, msg) {
		const matches = val.match(/^(?:<@&)?([0-9]+)>?$/);
		if (matches) return msg.guild.roles.cache.get(matches[1]) || null;
		const search = val.toLowerCase();
		const roles = msg.guild.roles.cache.filter(nameFilterInexact(search));
		if (roles.size === 0) return null;
		if (roles.size === 1) return roles.first();
		const exactRoles = roles.filter(nameFilterExact(search));
		if (exactRoles.size === 1) return exactRoles.first();
		return null;
	}
}

function nameFilterExact(search) {
	return thing => thing.name.toLowerCase() === search;
}

function nameFilterInexact(search) {
	return thing => thing.name.toLowerCase().includes(search);
}
