const UnionType = require('./UnionType');
const { list } = require('../util/Util');

module.exports = class Argument {
	constructor(client, options) {
		Object.defineProperty(this, 'client', { value: client });

		this.key = options.key;
		this.label = typeof options.label === 'undefined' ? null : options.label;
		this.typeID = options.type.toLowerCase();
		this.min = typeof options.min === 'undefined' ? null : options.min;
		this.max = typeof options.max === 'undefined' ? null : options.max;
		this.oneOf = typeof options.oneOf === 'undefined' ? null : options.oneOf;
		this.maxAttachmentSize = options.maxAttachmentSize || 8e+6;
		this.default = typeof options.default === 'undefined' ? null : options.default;
		this.infinite = options.infinite || false;
		this.avatarSize = options.avatarSize || 2048;
		this.validator = typeof options.validate === 'undefined' ? null : options.validate;
		this.parser = typeof options.parse === 'undefined' ? null : options.parse;
		this.emptyChecker = typeof options.isEmpty === 'undefined' ? null : options.isEmpty;
	}

	get type() {
		if (this.typeID.includes('|')) return new UnionType(this.client, this.typeID);
		return this.client.registry.types.get(this.typeID);
	}

	validate(val, msg, arg) {
		if (this.validator) return this.validator(val, msg, arg);
		return this.type.validate(val, msg, arg);
	}

	parse(val, msg, arg) {
		if (this.parser) return this.parser(val, msg, arg);
		return this.type.parse(val, msg, arg);
	}

	isEmpty(val, msg, arg) {
		if (this.emptyChecker) return this.emptyChecker(val, msg, arg);
		return this.type.isEmpty(val, msg, arg);
	}

	get invalidText() {
		if (this.oneOf) {
			return `It must be one of the following: ${list(this.oneOf, 'or')}`;
		} else if (this.max !== null && this.min !== null && (this.typeID === 'integer' || this.typeID === 'float')) {
			return `It must be a number from ${this.min} to ${this.max}.`;
		} else if (this.max !== null && this.min === null && (this.typeID === 'integer' || this.typeID === 'float')) {
			return `It must be a number less than or equal to ${this.max}.`;
		} else if (this.min !== null && this.max === null && (this.typeID === 'integer' || this.typeID === 'float')) {
			return `It must be a number greater than or equal to ${this.min}.`;
		} else if (this.min !== null && this.max !== null && this.typeID === 'string') {
			return `It must be at least ${this.min} characters long and at most ${this.max} characters long.`;
		} else if (this.min !== null && this.max === null && this.typeID === 'string') {
			return `It must be at least ${this.min} characters long.`;
		} else if (this.max !== null && this.min === null && this.typeID === 'string') {
			return `It must be at most ${this.max} characters long.`;
		} else if (this.type instanceof UnionType) {
			return `It must be a ${list(this.type.types.map(type => type.id), 'or a')}.`;
		}
		return `It must be a ${this.typeID}.`;
	}
};
