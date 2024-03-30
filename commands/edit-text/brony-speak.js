const Command = require('../../framework/Command');
const { wordTrans } = require('custom-translate');
const dictionary = require('../../assets/json/brony-speak');

module.exports = class BronySpeakCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'brony-speak',
			aliases: ['pony-speak', 'my-little-pony-speak', 'mlp-speak', 'brony'],
			group: 'edit-text',
			memberName: 'brony-speak',
			description: 'Converts text to brony speak.',
			credit: [
				{
					name: 'Hasbro',
					url: 'https://shop.hasbro.com/en-us',
					reason: 'Original "My Little Pony: Friendship is Magic" Show',
					reasonURL: 'https://mylittlepony.hasbro.com/en-us'
				},
				{
					name: 'Shrick',
					url: 'https://www.deviantart.com/shrick',
					reason: 'English-to-Brony Dictionary Data',
					reasonURL: 'https://www.deviantart.com/shrick/art/Brony-dictionary-version-2-207157029'
				}
			],
			args: [
				{
					key: 'text',
					type: 'string',
					validate: text => {
						if (wordTrans(text, dictionary).length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(wordTrans(text, dictionary));
	}
};
