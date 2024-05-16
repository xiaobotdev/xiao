const ArgumentType = require('../ArgumentType');
const words = require('../../assets/json/word-list');

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

	example(msg, arg) {
		if (arg.oneOf) return arg.oneOf[Math.floor(Math.random() * arg.oneOf.length)];
		let sentence = '';
		while (sentence.length <= (arg.min || 50) || sentence.length <= (arg.max || 100)) {
			const valid = words.filter(word => sentence.length + word.length + 1 <= (arg.max || 100));
			if (!valid.length) break;
			sentence += ` ${valid[Math.floor(Math.random() * valid.length)]}`;
		}
		return sentence.trim();
	}
};
