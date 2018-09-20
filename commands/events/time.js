const Command = require('../../structures/Command');
const moment = require('moment-timezone');
const { firstUpperCase } = require('../../util/Util');
moment.tz.link('America/Vancouver|Neopia');

module.exports = class TimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'time',
			aliases: ['time-zone'],
			group: 'events',
			memberName: 'time',
			description: 'Responds with the current time in a particular location.',
			details: '**Zones:** <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones>',
			args: [
				{
					key: 'timeZone',
					label: 'time zone',
					prompt: 'Which time zone do you want to get the time of?',
					type: 'string',
					parse: timeZone => timeZone.replace(/ /g, '_').toLowerCase()
				}
			]
		});
	}

	run(msg, { timeZone }) {
		if (!moment.tz.zone(timeZone)) {
			return msg.reply('Invalid time zone. Refer to <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones>.');
		}
		const time = moment().tz(timeZone).format('h:mm A');
		const location = timeZone.split('/');
		const main = firstUpperCase(location[0], /[_ ]/);
		const sub = location[1] ? firstUpperCase(location[1], /[_ ]/) : null;
		const subMain = location[2] ? firstUpperCase(location[2], /[_ ]/) : null;
		const parens = sub ? ` (${subMain ? `${sub}, ` : ''}${main})` : '';
		return msg.say(`The current time in ${subMain || sub || main}${parens} is ${time}.`);
	}
};
