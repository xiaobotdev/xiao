module.exports = class ArgumentType {
	constructor(client, id) {
		Object.defineProperty(this, 'client', { value: client });

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

	example() {
		return 'moo';
	}
};
