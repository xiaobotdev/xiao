const ArgumentType = require('../ArgumentType');
const { randomRange } = require('../../util/Util');

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

	example(msg, arg) {
		if (arg.oneOf) return arg.oneOf[Math.floor(Math.random() * arg.oneOf.length)];
		const min = arg.min || 0;
		const max = arg.max || 1000;
		return randomRange(min, max);
	}
};
