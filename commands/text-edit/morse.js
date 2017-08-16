const Command = require('../../structures/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('../../assets/json/morse');

module.exports = class MorseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'morse',
			group: 'text-edit',
			memberName: 'morse',
			description: 'Converts text to morse code.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert to morse?',
					type: 'string',
					validate: text => {
						if (letterTrans(text, dictionary, ' ').length < 2000) return true;
						return 'Your text is too long.';
					}
				}
			]
		});
	}

	run(msg, args) {
		const { text } = args;
		return msg.say(letterTrans(text.toLowerCase(), dictionary, ' '));
	}
};
