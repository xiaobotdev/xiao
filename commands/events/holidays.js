const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { GOOGLE_KEY, GOOGLE_CALENDAR_ID } = process.env;

module.exports = class HolidaysCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'holidays',
			aliases: ['google-calendar'],
			group: 'events',
			memberName: 'holidays',
			description: 'Responds with today\'s holidays.'
		});
	}

	async run(msg) {
		try {
			const { body } = await snekfetch
				.get(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events`)
				.query({
					maxResults: 10,
					orderBy: 'startTime',
					singleEvents: true,
					timeMax: this.tomorrow().toISOString(),
					timeMin: this.today().toISOString(),
					key: GOOGLE_KEY
				});
			if (!body.items.length) return msg.say('There are no holidays today...');
			return msg.say(body.items.map(holiday => holiday.summary).join('\n'));
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	today() {
		const now = new Date();
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);
		now.setMilliseconds(0);
		return now;
	}

	tomorrow() {
		const today = this.today();
		today.setDate(today.getDate() + 1);
		return today;
	}
};
