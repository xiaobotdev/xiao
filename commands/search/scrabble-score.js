const Command = require('../../structures/Command');
const letters = require('../../assets/json/scrabble-score');

module.exports = class ScrabbleScoreCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'scrabble-score',
			aliases: ['scrabble'],
			group: 'search',
			memberName: 'scrabble-score',
			description: 'Responds with the scrabble score of a word.',
			args: [
				{
					key: 'word',
					prompt: 'What word would you like to get the scrabble score of?',
					type: 'string',
					validate: word => {
						if (/^[A-Za-z ]+$/i.test(word.toLowerCase())) return true;
						return 'Invalid word, please only use A-Z and space.';
					},
					parse: word => word.toLowerCase()
				}
			]
		});
	}

	run(msg, { word }) {
		let score = 0;
		for (const letter of word.split('')) score += letters[letter];
		return msg.reply(score);
	}
};
