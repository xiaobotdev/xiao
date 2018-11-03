const Command = require('../../structures/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('../../assets/json/tebahpla');

module.exports = class TebahplaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tebahpla',
			aliases: ['reverse-alphabet', 'alphabet-reverse'],
			group: 'text-edit',
			memberName: 'tebahpla',
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
