const Command = require('../../framework/Command');
const { formatNumber } = require('../../util/Util');
const letters = require('../../assets/json/scrabble-score');

module.exports = class ScrabbleScoreCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'scrabble-score',
			aliases: ['scrabble'],
			group: 'analyze',
			memberName: 'scrabble-score',
			description: 'Responds with the scrabble score of a word.',
			credit: [
				{
					name: 'Hasbro',
					url: 'https://shop.hasbro.com/en-us',
					reason: 'Original "Scrabble" Game',
					reasonURL: 'https://scrabble.hasbro.com/en-us'
				}
			],
			args: [
				{
					key: 'word',
					prompt: 'What word would you like to get the scrabble score of?',
					type: 'string',
					parse: word => word.toLowerCase()
				}
			]
		});
	}

	run(msg, { word }) {
		let score = 0;
		for (const letter of word.split('')) {
			if (!letters[letter]) continue;
			score += letters[letter];
		}
		return msg.reply(formatNumber(score));
	}
};
