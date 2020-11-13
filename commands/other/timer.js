const Command = require('../../structures/Command');
const moment = require('moment');

module.exports = class TimerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'timer',
			group: 'other',
			memberName: 'timer',
			description: 'Sets a timer for anywhere from 1 second to 10 minutes.',
			args: [
				{
					key: 'time',
					prompt: 'How long should the timer last?',
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
			await msg.channel.send(`🕰️ Your **${display}** timer is finished ${msg.author}!`);
			this.timers.delete(msg.channel.id);
		}, timeMs);
		this.timers.set(msg.channel.id, timeout);
		return msg.say(`🕰️ Set a timer for **${display}**.`);
	}
};
