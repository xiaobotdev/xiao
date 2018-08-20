const Command = require('../../structures/Command');
const { wordTrans } = require('custom-translate');
const dictionary = require('../../assets/json/brony-speak');

module.exports = class BronySpeakCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'brony-speak',
			aliases: ['pony-speak'],
			group: 'text-edit',
			memberName: 'brony-speak',
			description: 'Converts text to brony speak.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert to brony speak?',
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
