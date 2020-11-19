const Command = require('../../structures/Command');
const moment = require('moment');

module.exports = class RemindCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'remind',
			aliases: ['timer', 'remind-me'],
			group: 'other',
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
		if (exists) return msg.reply('Only one reminder can be set per channel per user.');
		const timeMs = time.startDate.getTime() - Date.now();
		const display = moment().add(timeMs, 'ms').fromNow();
		const title = time.eventTitle || 'something';
		await this.client.timers.setTimer(msg.channel.id, timeMs, msg.author.id, title);
		return msg.say(`🕰️ Okay, I will remind you **"${title}"** ${display}.`);
	}
};
