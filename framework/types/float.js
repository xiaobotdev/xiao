const ArgumentType = require('../ArgumentType');
const { randomRange } = require('../../util/Util');

module.exports = class FloatArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'float');
	}

	validate(val, msg, arg) {
		const float = Number.parseFloat(val);
		if (Number.isNaN(float)) return false;
		if (arg.oneOf && !arg.oneOf.includes(float)) return false;
		if (arg.min !== null && typeof arg.min !== 'undefined' && float < arg.min) return false;
		if (arg.max !== null && typeof arg.max !== 'undefined' && float > arg.max) return false;
		return true;
	}

	parse(val) {
		return Number.parseFloat(val);
	}

	example(msg, arg) {
		if (arg.oneOf) return arg.oneOf[Math.floor(Math.random() * arg.oneOf.length)];
		const min = arg.min || 0;
		const max = arg.max || 1000;
		return randomRange(min, max);
	}
};
