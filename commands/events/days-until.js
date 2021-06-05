const Command = require('../../framework/Command');
const moment = require('moment');
require('moment-duration-format');

module.exports = class DaysUntilCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'days-until',
			aliases: ['countdown'],
			group: 'events',
			memberName: 'days-until',
			description: 'Responds with how many days there are until a certain date.',
			args: [
				{
					key: 'month',
					prompt: 'What month would you like to get the days until?',
					type: 'month'
				},
				{
					key: 'day',
					prompt: 'What day would you like to get the days until?',
					type: 'integer',
					min: 1,
					max: 31
				},
				{
					key: 'year',
					prompt: 'What year would you like to get the days until?',
					type: 'integer',
					min: new Date().getFullYear(),
					default: ''
				}
			]
		});
	}

	run(msg, { month, day, year }) {
		const now = new Date();
		if (!year) {
			year = now.getMonth() + 1 <= month ? now.getFullYear() : now.getFullYear() + 1;
			if (month === now.getMonth() + 1 && now.getDate() >= day) ++year;
		}
		const future = new Date(year, month - 1, day);
		const futureFormat = moment.utc(future).format('dddd, MMMM Do, YYYY');
		const time = moment.duration(future - now);
		if (time < 0) return msg.say('This date has already passed!');
		const link = time.months() ? time.months() === 1 ? 'is' : 'are' : time.days() === 1 ? 'is' : 'are';
		return msg.say(`There ${link} ${time.format('Y [years], M [months and] d [days]')} until ${futureFormat}!`);
	}
};
