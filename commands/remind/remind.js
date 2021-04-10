const Command = require('../../structures/Command');
const moment = require('moment');
const { shorten } = require('../../util/Util');

module.exports = class RemindCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'remind',
			aliases: ['timer', 'remind-me'],
			group: 'remind',
			memberName: 'remind',
			description: 'Sets a reminder.',
			args: [
				{
					key: 'time',
					prompt: 'What do you want me to remind you about, and in how long?',
					type: 'sherlock'
				}
			]
		});
	}

	async run(msg, { time }) {
		const exists = await this.client.timers.exists(msg.channel.id, msg.author.id);
		if (exists) return msg.reply('🕰️ Only one reminder can be set per channel per user.');
		const timeMs = time.startDate.getTime() - Date.now();
		if (timeMs > 0x7FFFFFFF) return msg.reply('🕰️ Reminders have a maximum length of ~24.84 days.');
		if (timeMs < 0) return msg.reply('🕰️ What do you expect me to do, time travel?');
		const display = moment().add(timeMs, 'ms').fromNow();
		const title = time.eventTitle ? shorten(time.eventTitle, 500) : 'something';
		await this.client.timers.setTimer(msg.channel.id, timeMs, msg.author.id, title);
		return msg.say(`🕰️ Okay, I will remind you **"${title}"** ${display}.`);
	}
};
