const Command = require('../../framework/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('../../assets/json/dvorak');

module.exports = class DvorakCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dvorak',
			group: 'edit-text',
			memberName: 'dvorak',
			description: 'Converts text to Dvorak encoding.',
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
