const ArgumentType = require('../ArgumentType');

module.exports = class IntegerArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'integer');
	}

	validate(val, msg, arg) {
		const int = Number.parseInt(val, 10);
		if (Number.isNaN(int)) return false;
		if (arg.oneOf && !arg.oneOf.includes(int)) return false;
		if (arg.min !== null && typeof arg.min !== 'undefined' && int < arg.min) return false;
		if (arg.max !== null && typeof arg.max !== 'undefined' && int > arg.max) return false;
		return true;
	}

	parse(val) {
		return Number.parseInt(val, 10);
	}
};
