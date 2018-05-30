const Command = require('../../structures/Command');

module.exports = class DaysUntilCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'days-until',
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
		const time = Math.round((future - now) / (1000 * 60 * 60 * 24)) + 1;
		if (!time) return msg.reply('Invalid date.');
		return msg.say(`There are ${time} days until ${future.toDateString()}!`);
	}
};
