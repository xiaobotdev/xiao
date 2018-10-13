const Command = require('../../structures/Command');
const { formatNumber } = require('../../util/Util');
const letters = require('../../assets/json/scrabble-score');

module.exports = class ScrabbleScoreCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'scrabble-score',
			aliases: ['scrabble'],
			group: 'number-edit',
			memberName: 'scrabble-score',
			description: 'Responds with the scrabble score of a word.',
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
