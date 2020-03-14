const Command = require('../../structures/Command');
const math = require('mathjs');

module.exports = class MathCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'math',
			aliases: ['mathematics', 'solve'],
			group: 'number-edit',
			memberName: 'math',
			description: 'Evaluates a math expression.',
			credit: [
				{
					name: 'mathjs',
					url: 'https://mathjs.org/',
					reason: 'Expression Parser'
				}
			],
			args: [
				{
					key: 'expression',
					prompt: 'What expression do you want to evaluate?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { expression }) {
		try {
			const evaluated = math.evaluate(expression).toString();
			return msg.reply(evaluated).catch(() => msg.reply('Invalid expression.'));
		} catch {
			return msg.reply('Invalid expression.');
		}
	}
};
