const Command = require('../../structures/Command');

module.exports = class TimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'time',
			aliases: ['time-zone'],
			group: 'events',
			memberName: 'time',
			description: 'Responds with the current time in a particular location.',
			details: '**Zones**: <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones>',
			args: [
				{
					key: 'timeZone',
					label: 'time zone',
					prompt: 'Which time zone do you want to get the time of?',
					type: 'string',
					parse: timeZone => timeZone.replace(/ /g, '_').toUpperCase()
				}
			]
		});
	}

	run(msg, { timeZone }) {
		if (timeZone === 'NEOPIA/STANDARD') timeZone = 'AMERICA/VANCOUVER';
		try {
			const time = new Date().toLocaleTimeString('en-US', { timeZone });
			return msg.say(`The current time in ${timeZone} is ${time}.`);
		} catch (err) {
			return msg.reply('Invalid time zone. Refer to <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones>.');
		}
	}
};
