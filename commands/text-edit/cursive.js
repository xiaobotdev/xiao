const Command = require('../../structures/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('../../assets/json/cursive');

module.exports = class CursiveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cursive',
			group: 'text-edit',
			memberName: 'cursive',
			description: 'Converts text to cursive.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert to cursive?',
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
