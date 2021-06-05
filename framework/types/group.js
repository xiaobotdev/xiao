const ArgumentType = require('../ArgumentType');

module.exports = class GroupArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'group');
	}

	validate(val) {
		const groups = this.client.registry.findGroups(val);
		if (groups.size === 1) return true;
		return false;
	}

	parse(val) {
		return this.client.registry.findGroups(val).first();
	}
}
