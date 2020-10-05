const Command = require('../../structures/Command');

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
					prompt: 'How long should the timer last (in seconds)?',
					type: 'integer',
					max: 600,
					min: 1
				}
			]
		});

		this.timers = new Map();
	}

	run(msg, { time }) {
		if (this.timers.has(msg.channel.id)) return msg.reply('Only one timer can be set per channel.');
		const display = time > 59 ? `${time / 60} minutes` : `${time} seconds`;
		const timeout = setTimeout(async () => {
			await msg.say(`🕰️ Your **${display}** timer is finished ${msg.author}!`);
			this.timers.delete(msg.channel.id);
		}, time * 1000);
		this.timers.set(msg.channel.id, timeout);
		return msg.say(`🕰️ Set a timer for **${display}**.`);
	}
};
