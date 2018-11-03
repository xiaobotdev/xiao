const Command = require('../../structures/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('../../assets/json/fancy');

module.exports = class FancyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fancy',
			group: 'text-edit',
			memberName: 'fancy',
			description: 'Converts text to fancy letters.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert to fancy letters?',
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
