const Command = require('../../structures/Command');
const moment = require('moment');

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

	async run(msg, { time }) {
		const timeMs = time.startDate.getTime() - Date.now();
		const display = moment().add(timeMs, 'ms').fromNow();
		return msg.say(`This time duration parses as **${display}**.`);
	}
};
