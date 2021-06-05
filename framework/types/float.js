const ArgumentType = require('../ArgumentType');

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
};
