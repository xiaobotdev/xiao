const Command = require('../../framework/Command');
const { shuffle } = require('../../util/Util');

module.exports = class ShuffleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shuffle',
			group: 'edit-text',
			description: 'Shuffles text.',
			args: [
				{
					key: 'text',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(shuffle(text.split('')).join(''));
	}
};
