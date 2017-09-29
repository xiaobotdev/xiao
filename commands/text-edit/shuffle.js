const { Command } = require('discord.js-commando');
const { shuffle } = require('../../structures/Util');

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

	run(msg, { text }) {
		return msg.say(shuffle(text.split('')).join(''));
	}
};
