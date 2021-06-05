const Argument = require('../framework/ArgumentType');
const { months, shorthand } = require('../assets/json/month');

module.exports = class MonthArgument extends Argument {
	constructor(client) {
		super(client, 'month');
	}

	validate(value) {
		const num = Number.parseInt(value, 10);
		if (num > 0 && num < 13) return true;
		if (months.includes(value.toLowerCase())) return true;
		if (shorthand.includes(value.toLowerCase())) return true;
		return false;
	}

	parse(value) {
		const num = Number.parseInt(value, 10);
		if (!Number.isNaN(num)) return num;
		if (months.includes(value.toLowerCase())) return months.indexOf(value.toLowerCase()) + 1;
		if (shorthand.includes(value.toLowerCase())) return shorthand.indexOf(value.toLowerCase()) + 1;
		return null;
	}
};
