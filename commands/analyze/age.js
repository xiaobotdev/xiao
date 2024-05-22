const Command = require('../../framework/Command');

module.exports = class AgeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'age',
			group: 'analyze',
			description: 'Responds with how old someone born in a certain year is.',
			args: [
				{
					key: 'year',
					type: 'integer',
					min: 1
				}
			]
		});
	}

	run(msg, { year }) {
		const currentYear = new Date().getFullYear();
		const age = currentYear - year;
		if (age < 0) return msg.say(`Someone born in ${year} will be born in ${Math.abs(age)} years.`);
		return msg.say(`Someone born in ${year} would be ${age} years old.`);
	}
};
