const ArgumentType = require('../ArgumentType');

module.exports = class CommandArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'command');
	}

	validate(val) {
		const commands = this.client.registry.findCommands(val);
		if (commands.size === 1) return true;
		return false;
	}

	parse(val) {
		return this.client.registry.findCommands(val).first();
	}

	example() {
		return this.client.registry.commands.random().name;
	}
};
