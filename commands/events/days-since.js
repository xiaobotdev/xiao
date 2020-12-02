const Command = require('../../structures/Command');
const moment = require('moment');
require('moment-duration-format');

module.exports = class DaysSinceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'days-since',
			group: 'events',
			memberName: 'days-since',
			description: 'Responds with how many days there have been since a certain date.',
			args: [
				{
					key: 'month',
					prompt: 'What month would you like to get the days since?',
					type: 'month'
				},
				{
					key: 'day',
					prompt: 'What day would you like to get the days since?',
					type: 'integer',
					min: 1,
					max: 31
				},
				{
					key: 'year',
					prompt: 'What year would you like to get the days since?',
					type: 'integer',
					min: 1
				}
			]
		});
	}

	run(msg, { month, day, year }) {
		const now = new Date();
		const past = new Date(year, month - 1, day);
		if (year > 100) past.setFullYear(year);
		const pastFormat = moment.utc(past).format('dddd, MMMM Do, YYYY');
		const time = moment.duration(now - past);
		return msg.say(`There have been ${time.format('Y [years,] M [months and] d [days]')} since ${pastFormat}!`);
	}
};
