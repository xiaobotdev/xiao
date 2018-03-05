const { Command } = require('discord.js-commando');
const { base64 } = require('../../util/Util');

module.exports = class Base64Command extends Command {
	constructor(client) {
		super(client, {
			name: 'base64',
			aliases: ['base-64'],
			group: 'text-edit',
			memberName: 'base64',
			description: 'Converts text to Base64.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert to Base64?',
					type: 'string',
					validate: text => {
						if (base64(text).length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(base64(text));
	}
};
