const { ArgumentType } = require('discord.js-commando');
const { list } = require('../util/Util');

class ChoiceArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'choice');
	}

	validate(value, msg, arg) {
		if (arg.choices.includes(value.toLowerCase())) return true;
		return `Invalid ${arg.label}, please enter either ${list(arg.choices, 'or')}.`;
	}

	parse(value) {
		return value.toLowerCase();
	}
}

module.exports = ChoiceArgumentType;
