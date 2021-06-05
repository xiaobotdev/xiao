const UnionType = require('./UnionType');

module.exports = class Argument {
	constructor(client, options) {
		Object.defineProperty(this, 'client', { value: client });

		this.key = options.key.toLowerCase();
		this.typeID = options.type.toLowerCase();
		this.min = options.min;
		this.max = options.max;
		this.oneOf = options.oneOf;
		this.default = options.default;
		this.avatarSize = options.avatarSize || 2048;
	}

	get type() {
		if (this.typeID.includes('|')) return new UnionType(this.client, this.typeID);
		return this.client.registry.types.get(this.typeID);
	}
};
