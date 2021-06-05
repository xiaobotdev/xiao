const Command = require('../../framework/Command');
const { wordTrans } = require('custom-translate');
const dictionary = require('../../assets/json/pirate');

module.exports = class PirateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pirate',
			aliases: ['pirate-speak'],
			group: 'edit-text',
			memberName: 'pirate',
			description: 'Converts text to pirate.',
			credit: [
				{
					name: 'mikewesthad',
					url: 'https://github.com/mikewesthad',
					reason: 'English-to-Pirate Dictionary Data',
					reasonURL: 'https://github.com/mikewesthad/pirate-speak/blob/master/lib/pirate-speak.js#L1-L155'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert to pirate?',
					type: 'string',
					validate: text => {
						if (wordTrans(text, dictionary).length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(wordTrans(text, dictionary));
	}
};
