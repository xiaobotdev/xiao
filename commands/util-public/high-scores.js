const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const moment = require('moment');
require('moment-duration-format');
const minesweeperSizes = [3, 4, 5, 6, 7, 8, 9, 10];

module.exports = class HighScoresCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'high-scores',
			aliases: ['high-score', 'hs', 'h-score', 'high-s'],
			group: 'util-public',
			memberName: 'high-scores',
			description: 'Responds with the high scores the bot has saved.',
			guarded: true
		});
	}

	async run(msg) {
		const typingRaceGet = await this.client.redis.get('typing-test');
		const typingRace = typingRaceGet ? Number.parseInt(typingRaceGet, 10) : null;
		const anagramsGet = await this.client.redis.get('anagramica');
		const anagrams = anagramsGet ? Number.parseInt(anagramsGet, 10) : null;
		const minesweeperScores = {};
		for (const size of minesweeperSizes) {
			const minesweeperGet = await this.client.redis.get(`minesweeper-${size}`);
			const minesweeper = minesweeperGet ? Number.parseInt(minesweeperGet, 10) : null;
			minesweeperScores[size] = moment.duration(minesweeper).format('mm:ss');
		}
		const reactionTimeGet = await this.client.redis.get('reaction-time');
		const reactionTime = reactionTimeGet ? Number.parseInt(reactionTimeGet, 10) : null;
		return msg.say(stripIndents`
			__**Single-Score Games:**__
			\`typing-race\`/\`typing-test\`: ${typingRace / 1000}s
			\`anagramica\`: ${anagrams}
			\`reaction-time\`: ${reactionTime / 1000}s

			__**Minesweeper:**__
			${Object.entries(minesweeperScores).map(([size, score]) => `\`${size}x${size}\`: ${score}`).join('\n')}
		`);
	}
};
