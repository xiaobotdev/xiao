const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const request = require('node-superfetch');
const { shuffle, reactIfAble, fetchHSUserDisplay } = require('../../util/Util');
const scores = require('../../assets/json/anagramica');
const pool = 'abcdefghijklmnopqrstuvwxyz'.split('');
const vowels = ['a', 'e', 'i', 'o', 'u'];
const { SUCCESS_EMOJI_ID, FAILURE_EMOJI_ID } = process.env;

module.exports = class AnagramicaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'anagramica',
			aliases: ['anagram-game', 'anagram-quiz', 'anagram', 'anagrams'],
			group: 'games-sp',
			memberName: 'anagramica',
			description: 'Try to find all the anagrams for a given set of letters.',
			game: true,
			credit: [
				{
					name: 'Max Irwin',
					url: 'http://binarymax.com/',
					reason: 'Original "Anagramica" Game, API',
					reasonURL: 'http://anagramica.com/'
				}
			],
			args: [
				{
					key: 'time',
					type: 'integer',
					default: 45,
					max: 90,
					min: 15
				}
			]
		});
	}

	async run(msg, { time }) {
		const { valid, letters } = await this.fetchList();
		let points = 0;
		await msg.reply(stripIndents`
			**You have ${time} seconds to provide anagrams for the following letters:**
			${letters.map(letter => `\`${letter.toUpperCase()}\``).join(' ')}

			_Need to see the list again? Type \`send list\` (or \`sl\`)._
		`);
		const picked = [];
		const filter = res => {
			if (res.author.id !== msg.author.id) return false;
			const choice = res.content.toLowerCase();
			if (choice === 'send list' || choice === 'sl') {
				msg.reply(letters.map(letter => `\`${letter.toUpperCase()}\``).join(' ')).catch(() => null);
				return true;
			}
			if (picked.includes(choice)) return false;
			const score = this.getScore(letters, choice);
			if (!score) return false;
			if (!valid.includes(choice)) {
				picked.push(choice);
				reactIfAble(res, res.author, FAILURE_EMOJI_ID, '❌');
				return false;
			}
			points += score;
			picked.push(choice);
			reactIfAble(res, res.author, SUCCESS_EMOJI_ID, '✅');
			return true;
		};
		const msgs = await msg.channel.awaitMessages({
			filter,
			time: time * 1000
		});
		const highScoreGet = await this.client.redis.get('anagramica');
		const highScore = highScoreGet ? Number.parseInt(highScoreGet, 10) : null;
		const highScoreUser = await this.client.redis.get('anagramica-user');
		const scoreBeat = !highScore || highScore < points;
		const user = await fetchHSUserDisplay(this.client, highScoreUser);
		if (scoreBeat) {
			await this.client.redis.set('anagramica', points);
			await this.client.redis.set('anagramica-user', msg.author.id);
		}
		const moreWords = shuffle(valid.filter(word => !picked.includes(word))).slice(0, 5);
		if (!msgs.size) {
			return msg.reply(stripIndents`
				Couldn't even think of one? Ouch.
				${scoreBeat ? `**New High Score!** Old:` : `High Score:`} ${highScore} (Held by ${user})

				Here's some words you missed: ${moreWords.map(word => `\`${word}\``).join(', ')}
			`);
		}
		return msg.reply(stripIndents`
			Nice job! Your final score was **${points}**!
			${scoreBeat ? `**New High Score!** Old:` : `High Score:`} ${highScore} (Held by ${user})

			Here's some words you missed: ${moreWords.map(word => `\`${word}\``).join(', ')}
		`);
	}

	async fetchList() {
		const letters = [];
		letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
		letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
		for (let i = 0; i < 8; i++) letters.push(pool[Math.floor(Math.random() * pool.length)]);
		const { body } = await request.get(`http://www.anagramica.com/all/${letters.join('')}`);
		return { valid: body.all, letters: shuffle(letters) };
	}

	getScore(letters, word) {
		let score = 0;
		for (const letter of word.split('')) {
			if (!letters.includes(letter)) return null;
			score += scores[letter];
		}
		return score;
	}
};
