const { Command } = require('discord.js-commando');
const { wordTrans } = require('custom-translate');
const dictionary = require('./temmiewords');

module.exports = class TemmieCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'temmie',
			group: 'textedit',
			memberName: 'temmie',
			description: 'Translate text to Temmie speak.',
			args: [
				{
                	key: 'text',
                	prompt: 'What text would you like to convert to Temmie speak?',
                	type: 'string',
                	validate: text => {
                		if(wordTrans(text, dictionary).length < 1999)
                			return true;
                		return 'Your message content is too long.';
                	},
                	parse: text => wordTrans(text, dictionary)
				}
            ]
		});
	}

	run(msg, args) {
		const { text } = args;
		return msg.say(`\u180E${text}`);
	}
};
