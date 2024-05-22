const Command = require('../../framework/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('../../assets/json/braille');

module.exports = class BrailleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'braille',
			group: 'edit-text',
			description: 'Converts text to braille.',
			args: [
				{
					key: 'text',
					type: 'string',
					validate: text => {
						if (letterTrans(text, dictionary).length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(letterTrans(text, dictionary));
	}
};
