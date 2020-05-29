const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const request = require('node-superfetch');
const scores = require('../../assets/json/anagramica');
const pool = 'abcdefghijklmnopqrstuvwxyz'.split('');
const { SUCCESS_EMOJI_ID, FAILURE_EMOJI_ID } = process.env;

module.exports = class AnagramicaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'anagramica',
			aliases: ['anagram-game', 'anagram-quiz'],
			group: 'games-sp',
			memberName: 'anagramica',
			description: 'Try to find all the anagrams for a given set of letters.',
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
					prompt: 'How long should the game last in seconds? Max 90, min 15.',
					type: 'integer',
					default: 45,
					max: 90,
					min: 15
				}
			]
		});
	}

	async run(msg, { time }) {
		try {
			const { valid, letters } = await this.fetchList();
			let points = 0;
			await msg.reply(stripIndents`
				**You have ${time} seconds to provide anagrams for the following letters:**
				${letters.map(letter => `\`${letter.toUpperCase()}\``).join(' ')}
			`);
			const picked = [];
			const filter = res => {
				if (res.author.id !== msg.author.id) return false;
				if (picked.includes(res.content.toLowerCase())) return false;
				const score = this.getScore(letters, res.content.toLowerCase());
				if (!score) return false;
				if (!valid.includes(res.content.toLowerCase())) {
					points -= score;
					picked.push(res.content.toLowerCase());
					res.react(FAILURE_EMOJI_ID || '❌').catch(() => null);
					return false;
				}
				points += score;
				picked.push(res.content.toLowerCase());
				res.react(SUCCESS_EMOJI_ID || '✅').catch(() => null);
				return true;
			};
			const msgs = await msg.channel.awaitMessages(filter, {
				time: time * 1000
			});
			if (!msgs.size) return msg.reply('Couldn\'t even think of one? Ouch.');
			if (points < 1) return msg.reply(`Ouch, your final score was **${points}**. Try harder next time!`);
			return msg.reply(`Nice job! Your final score was **${points}**!`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchList() {
		const letters = [];
		for (let i = 0; i < 10; i++) letters.push(pool[Math.floor(Math.random() * pool.length)]);
		const { body } = await request.get(`http://www.anagramica.com/all/${letters.join('')}`);
		return { valid: body.all, letters };
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
