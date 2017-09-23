const Command = require('../../structures/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('../../assets/json/alphabet-reverse');

module.exports = class AlphabetReverseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'alphabet-reverse',
			aliases: ['reverse-alphabet', 'tebahpla'],
			group: 'text-edit',
			memberName: 'alphabet-reverse',
			description: 'Reverses the alphabet of text.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to reverse the alphabet of?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(letterTrans(text, dictionary));
	}
};
