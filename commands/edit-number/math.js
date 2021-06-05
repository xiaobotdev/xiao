const Command = require('../../framework/Command');
const core = require('mathjs/number');
const math = core.create(core.all);
const limitedEvaluate = math.evaluate;
math.import({
	import: () => { throw new Error('Function import is disabled'); },
	createUnit: () => { throw new Error('Function createUnit is disabled'); },
	evaluate: () => { throw new Error('Function evaluate is disabled'); },
	parse: () => { throw new Error('Function parse is disabled'); },
	simplify: () => { throw new Error('Function simplify is disabled'); },
	derivative: () => { throw new Error('Function derivative is disabled'); }
}, { override: true });

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
			if (expression.includes(':')) return msg.reply('Invalid expression.');
			const evaluated = limitedEvaluate(expression);
			if (typeof evaluated === 'function') return msg.reply('Invalid expression.');
			return msg.reply(evaluated.toString());
		} catch {
			return msg.reply('Invalid expression.');
		}
	}
};
