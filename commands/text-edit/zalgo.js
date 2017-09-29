const { Command } = require('discord.js-commando');
const zalgo = require('zalgolize');

module.exports = class ZalgoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'zalgo',
			aliases: ['zalgolize'],
			group: 'text-edit',
			memberName: 'zalgo',
			description: 'Converts text to zalgo.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert to zalgo?',
					type: 'string',
					validate: text => {
						if (text.length < 500) return true;
						return 'Invalid text, please keep the text under 500 characters.';
					}
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(zalgo(text));
	}
};
