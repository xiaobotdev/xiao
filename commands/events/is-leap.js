const Command = require('../../framework/Command');
const { isLeap } = require('../../util/Util');

module.exports = class IsLeapCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'is-leap',
			aliases: ['is-leap-year', 'leap-year', 'leap'],
			group: 'events',
			memberName: 'is-leap',
			description: 'Responds with if a year is a leap year.',
			args: [
				{
					key: 'year',
					type: 'integer',
					default: () => new Date().getFullYear(),
					min: 1
				}
			]
		});
	}

	run(msg, { year }) {
		return msg.say(`${year} **${isLeap(year) ? 'is' : 'is not'}** a leap year.`);
	}
};
