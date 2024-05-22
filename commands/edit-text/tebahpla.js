const Command = require('../../framework/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('../../assets/json/tebahpla');

module.exports = class TebahplaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tebahpla',
			aliases: ['reverse-alphabet', 'alphabet-reverse'],
			group: 'edit-text',
			description: 'Reverses the alphabet of text.',
			args: [
				{
					key: 'text',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(letterTrans(text, dictionary));
	}
};
