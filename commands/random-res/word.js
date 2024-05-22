const Command = require('../../framework/Command');
const words = require('../../assets/json/word-list');

module.exports = class WordCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'word',
			aliases: ['random-word'],
			group: 'random-res',
			description: 'Responds with a random word.',
			credit: [
				{
					name: 'Grady Ward',
					url: 'https://en.wikipedia.org/wiki/Grady_Ward',
					reason: 'Moby Word Lists',
					reasonURL: 'http://www.gutenberg.org/ebooks/3201'
				}
			]
		});
	}

	run(msg) {
		const word = words[Math.floor(Math.random() * words.length)];
		return msg.reply(word.toLowerCase());
	}
};
