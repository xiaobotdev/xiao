const { Command } = require('discord.js-commando');
const { wait } = require('../../util/Util');

module.exports = class TimerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'timer',
			group: 'other',
			memberName: 'timer',
			description: 'Sets a timer for a certain amount of time.',
			args: [
				{
					key: 'seconds',
					prompt: 'How many seconds do you want to set a timer for?',
					type: 'float',
					min: 1,
					max: 600
				}
			]
		});

		this.timers = new Set();
	}

	async run(msg, { seconds }) {
		if (this.timers.has(msg.author.id)) return msg.reply('You can only have one timer at a time.');
		this.timers.add(msg.author.id);
		await msg.say(`Setting a timer for ${seconds} seconds...`);
		await wait(seconds / 1000);
		this.timers.delete(msg.author.id);
		return msg.reply('Time\'s up!');
	}
};
