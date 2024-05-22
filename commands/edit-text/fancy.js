const Command = require('../../framework/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('../../assets/json/fancy');

module.exports = class FancyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fancy',
			group: 'edit-text',
			description: 'Converts text to fancy letters.',
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
