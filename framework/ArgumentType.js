module.exports = class ArgumentType {
	constructor(id) {
		this.id = id.toLowerCase();
	}

	validate(val) {
		return Boolean(val);
	}

	parse(val) {
		return val;
	}

	isEmpty(val) {
		return !val;
	}
};
