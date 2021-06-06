const UnionType = require('./UnionType');

module.exports = class Argument {
	constructor(client, options) {
		Object.defineProperty(this, 'client', { value: client });

		this.key = options.key.toLowerCase();
		this.label = typeof options.label === 'undefined' ? null : options.label;
		this.typeID = options.type.toLowerCase();
		this.min = typeof options.min === 'undefined' ? null : options.min;
		this.max = typeof options.max === 'undefined' ? null : options.max;
		this.oneOf = typeof options.oneOf === 'undefined' ? null : options.oneOf;
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
};
