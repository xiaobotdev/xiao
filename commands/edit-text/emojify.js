const Command = require('../../framework/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('../../assets/json/emojify');

module.exports = class EmojifyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emojify',
			aliases: ['regional-indicator', 'big-text'],
			group: 'edit-text',
			description: 'Converts text to emoji form.',
			args: [
				{
					key: 'text',
					type: 'string',
					validate: text => {
						if (letterTrans(text.toLowerCase(), dictionary, ' ').length < 2000) return true;
						return 'Invalid text, your text is too long.';
					},
					parse: text => text.toLowerCase()
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(letterTrans(text, dictionary, ' '));
	}
};
