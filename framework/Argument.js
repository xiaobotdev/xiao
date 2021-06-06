const UnionType = require('./UnionType');

module.exports = class Argument {
	constructor(client, options) {
		Object.defineProperty(this, 'client', { value: client });

		this.key = options.key.toLowerCase();
		this.label = options.label || null;
		this.typeID = options.type.toLowerCase();
		this.min = options.min || null;
		this.max = options.max || null;
		this.oneOf = options.oneOf || null;
		this.default = options.default || null;
		this.infinite = options.infinite || false;
		this.avatarSize = options.avatarSize || 2048;
		this.validator = options.validate || null;
		this.parser = options.parse || null;
		this.emptyChecker = options.isEmpty || null;
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
