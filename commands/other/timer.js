const Command = require('../../structures/Command');
const moment = require('moment');

module.exports = class TimerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'timer',
			aliases: ['remind', 'remind-me'],
			group: 'other',
			memberName: 'timer',
			description: 'Sets a timer.',
			args: [
				{
					key: 'time',
					prompt: 'What do you want me to remind you about, and in how long?',
					type: 'sherlock'
				}
			]
		});

		this.timers = new Map();
	}

	run(msg, { time }) {
		if (this.timers.has(msg.channel.id)) return msg.reply('Only one timer can be set per channel.');
		const timeMs = time.startDate.getTime() - Date.now();
		if (timeMs > 600000) return msg.reply('Times above 10 minutes are not currently supported. Sorry!');
		const display = moment().add(timeMs, 'ms').fromNow();
		const timeout = setTimeout(async () => {
			await msg.channel.send(`🕰️ ${msg.author}, you wanted me to remind you of: **"${time.eventTitle}"**.`);
			this.timers.delete(msg.channel.id);
		}, timeMs);
		this.timers.set(msg.channel.id, timeout);
		return msg.say(`🕰️ Okay, I will remind you **"${time.eventTitle}"** ${display}.`);
	}
};
