const Command = require('../../framework/Command');
const moment = require('moment');
const { shorten } = require('../../util/Util');

module.exports = class RemindCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'remind',
			aliases: ['timer', 'remind-me'],
			group: 'remind',
			description: 'Sets a reminder.',
			args: [
				{
					key: 'time',
					type: 'sherlock'
				}
			]
		});
	}

	async run(msg, { time }) {
		const timeMs = time.startDate.getTime() - Date.now();
		if (timeMs > 0x7FFFFFFF) return msg.reply('🕰️ Reminders have a maximum length of ~24.84 days.');
		if (timeMs < 0) return msg.reply('🕰️ What do you expect me to do, time travel?');
		const display = moment().add(timeMs, 'ms').fromNow();
		const title = time.eventTitle ? shorten(time.eventTitle, 500) : 'something';
		await this.client.timers.setTimer(null, msg.channel.id, timeMs, msg.author.id, title);
		return msg.say(`🕰️ Okay, I will remind you **"${title}"** ${display}.`);
	}
};
