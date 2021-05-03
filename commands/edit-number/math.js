const Command = require('../../structures/Command');
const core = require('mathjs/number');
const math = core.create(core.all);

module.exports = class MathCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'math',
			aliases: ['mathematics', 'solve'],
			group: 'edit-number',
			memberName: 'math',
			description: 'Evaluates a math expression.',
			args: [
				{
					key: 'expression',
					prompt: 'What expression do you want to evaluate?',
					type: 'string'
				}
			],
			credit: [
				{
					name: 'mathjs',
					url: 'https://mathjs.org/',
					reason: 'Expression Parser'
				}
			]
		});
	}

	run(msg, { expression }) {
		try {
			const evaluated = math.evaluate(expression);
			if (typeof result === 'function') return msg.reply('Invalid expression.');
			return msg.reply(evaluated.toString());
		} catch {
			return msg.reply('Invalid expression.');
		}
	}
};
