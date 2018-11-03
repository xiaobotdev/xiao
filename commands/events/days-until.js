const Command = require('../../structures/Command');
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
				}
			]
		});
	}

	run(msg, { month, day }) {
		const now = new Date();
		let year = now.getMonth() + 1 <= month ? now.getFullYear() : now.getFullYear() + 1;
		if (month === now.getMonth() + 1 && now.getDate() >= day) ++year;
		const future = new Date(`${month}/${day}/${year}`);
		const futureFormat = moment.utc(future).format('dddd, MMMM Do, YYYY');
		const time = moment.duration(future - now);
		const link = time.months() ? time.months() === 1 ? 'is' : 'are' : time.days() === 1 ? 'is' : 'are';
		return msg.say(`There ${link} ${time.format('M [months and] d [days]')} until ${futureFormat}!`);
	}
};
