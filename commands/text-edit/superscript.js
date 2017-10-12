const { Command } = require('discord.js-commando');
const { letterTrans } = require('custom-translate');
const dictionary = require('../../assets/json/superscript');

module.exports = class SuperscriptCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'superscript',
			aliases: ['tiny-text', 'small-text'],
			group: 'text-edit',
			memberName: 'superscript',
			description: 'Makes text become tiny text.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to make tiny?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(letterTrans(text, dictionary));
	}
};
