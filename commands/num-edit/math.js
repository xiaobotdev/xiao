const { Command } = require('discord.js-commando');
const math = require('mathjs');

module.exports = class MathCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'math',
			aliases: ['calculator', 'calc'],
			group: 'num-edit',
			memberName: 'math',
			description: 'Evaluates math expressions.',
			args: [
				{
					key: 'expression',
					prompt: 'What expression would you like to evaluate?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { expression }) {
		try {
			const answer = math.eval(expression).toString();
			return msg.say(answer).catch(() => msg.reply('Invalid expression.'));
		} catch (err) {
			return msg.reply('Invalid expression.');
		}
	}
};
