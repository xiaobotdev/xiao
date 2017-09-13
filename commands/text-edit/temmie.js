const Command = require('../../structures/Command');
const { wordTrans } = require('custom-translate');
const dictionary = require('../../assets/json/temmie');

module.exports = class TemmieCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'temmie',
			group: 'text-edit',
			memberName: 'temmie',
			description: 'Converts text to Temmie speak.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert to Temmie speak?',
					type: 'string',
					validate: text => {
						if (wordTrans(text, dictionary).length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, args) {
		const { text } = args;
		return msg.say(wordTrans(text, dictionary));
	}
};
