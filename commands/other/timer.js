const Command = require('../../structures/Command');
const { delay } = require('../../util/Util');

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
	}

	async run(msg, { time }) {
		const display = time > 59 ? `${time / 60} minutes` : `${time} seconds`;
		await msg.say(`🕰️ Set a timer for **${display}**.`);
		await delay(time * 1000);
		return msg.say(`🕰️ Your **${display}** timer is finished ${msg.author}!`);
	}
};
