const Command = require('../../structures/Command');
const { shuffle } = require('../../structrues/Util');

module.exports = class ShuffleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shuffle',
			group: 'text-edit',
			memberName: 'shuffle',
			description: 'Shuffles text.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to shuffle?',
					type: 'string'
				}
			]
		});
	}

	run(msg, args) {
		const { text } = args;
		const converted = shuffle(text.split('')).join('');
		return msg.say(`\u180E${converted}`);
	}
};
