const ArgumentType = require('../ArgumentType');

module.exports = class StringArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'string');
	}

	validate(val, msg, arg) {
		if (arg.oneOf && !arg.oneOf.includes(val.toLowerCase())) return false;
		if (arg.min !== null && typeof arg.min !== 'undefined' && val.length < arg.min) return false;
		if (arg.max !== null && typeof arg.max !== 'undefined' && val.length > arg.max) return false;
		return true;
	}

	parse(val) {
		return val;
	}
};
