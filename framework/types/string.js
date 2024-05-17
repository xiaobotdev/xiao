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
		while (sentence.length <= (arg.max ? Math.min(arg.max, 50) : 50)) {
			const valid = words.filter(word => {
				const max = arg.max ? Math.min(arg.max, 50) : 50;
				return sentence.length + word.length + 1 <= max;
			});
			if (!valid.length) break;
			sentence += ` ${valid[Math.floor(Math.random() * valid.length)]}`;
		}
		return sentence.trim();
	}
};
