const Command = require('../../structures/Command');
const math = require('mathjs');

module.exports = class MathCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'math',
			group: 'num-edit',
			memberName: 'math',
			description: 'Evaluates math expressions.',
			args: [
				{
					key: 'expression',
					prompt: 'What do you want to answer?',
					type: 'string'
				}
			]
		});
	}

	run(msg, args) {
		const { expression } = args;
		try {
			const solved = math.eval(expression).toString();
			return msg.say(solved).catch(() => msg.say('Invalid statement.'));
		} catch (err) {
			return msg.say('Invalid statement.');
		}
	}
};
