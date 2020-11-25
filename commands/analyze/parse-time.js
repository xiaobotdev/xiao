const Command = require('../../structures/Command');
const moment = require('moment');
require('moment-duration-format');

module.exports = class ParseTimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'parse-time',
			aliases: ['analyze-time', 'sherlock'],
			group: 'analyze',
			memberName: 'parse-time',
			description: 'Analyzes the time duration you provide and gives the result.',
			args: [
				{
					key: 'time',
					prompt: 'What do you want me to analyze?',
					type: 'sherlock'
				}
			]
		});
	}

	run(msg, { time }) {
		const duration = moment.duration(time.startDate.getTime() - Date.now());
		const display = duration.format('Y [years,] M [months,] d [days,] h [hours,] m [minutes and] s [seconds]');
		return msg.say(`This time duration parses as **${display}**.`);
	}
};
