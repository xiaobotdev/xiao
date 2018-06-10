const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { today, tomorrow } = require('../../util/Util');
const { GOOGLE_KEY, GOOGLE_CALENDAR_ID } = process.env;

module.exports = class HolidaysCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'holidays',
			aliases: ['google-calendar', 'holiday'],
			group: 'events',
			memberName: 'holidays',
			description: 'Responds with today\'s holidays.'
		});
	}

	async run(msg) {
		try {
			const { body } = await request
				.get(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events`)
				.query({
					maxResults: 10,
					orderBy: 'startTime',
					singleEvents: true,
					timeMax: tomorrow().toISOString(),
					timeMin: today().toISOString(),
					key: GOOGLE_KEY
				});
			if (!body.items.length) return msg.say('There are no holidays today...');
			return msg.say(body.items.map(holiday => holiday.summary).join('\n'));
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
