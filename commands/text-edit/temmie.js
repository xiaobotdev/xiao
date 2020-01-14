const Command = require('../../structures/Command');
const { wordTrans } = require('custom-translate');
const dictionary = require('../../assets/json/temmie');

module.exports = class TemmieCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'temmie',
			aliases: ['temmie-speak'],
			group: 'text-edit',
			memberName: 'temmie',
			description: 'Converts text to Temmie speak.',
			credit: [
				{
					name: 'UNDERTALE',
					url: 'https://undertale.com/',
					reason: 'Original Game'
				},
				{
					name: 'ebearskittychan',
					url: 'https://twitter.com/ebearskittychan',
					reason: 'English-to-Temmie Dictionary Data'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert to Temmie speak?',
					type: 'string',
					validate: text => {
						if (this.temmize(text).length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(this.temmize(text));
	}

	temmize(text) {
		return wordTrans(text, dictionary)
			.replace(/ing/gi, 'in')
			.replace(/!/g, '!!!!111!1!')
			.replace(/'/g, '');
	}
};
