const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { delay, verify } = require('../../util/Util');
const startWords = require('../../assets/json/word-list');
const { WORDNIK_KEY } = process.env;

module.exports = class WordChainCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'word-chain',
			group: 'games',
			memberName: 'word-chain',
			description: 'Try to come up with words that start with the last letter of your opponent\'s word.',
			guildOnly: true,
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to challenge?',
					type: 'user'
				},
				{
					key: 'time',
					prompt: 'How long do you want to wait for input of new words (in seconds)?',
					type: 'integer',
					default: 10,
					max: 10,
					min: 1
				}
			]
		});

		this.playing = new Set();
	}

	async run(msg, { opponent, time }) {
		if (opponent.bot) return msg.reply('Bots may not be played against.');
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
		if (this.playing.has(msg.channel.id)) return msg.reply('Only one game may be occurring per channel.');
		this.playing.add(msg.channel.id);
		try {
			await msg.say(`${opponent}, do you accept this challenge?`);
			const verification = await verify(msg.channel, opponent);
			if (!verification) {
				this.playing.delete(msg.channel.id);
				return msg.say('Looks like they declined...');
			}
			const startWord = startWords[Math.floor(Math.random() * startWords.length)];
			await msg.say(stripIndents`
				The start word will be **${startWord}**! You must answer within **${time}** seconds!
				If you think your opponent has played a word that doesn't exist, respond with **challenge** on your turn.
				Words cannot contain anything but letters. No numbers, spaces, or hyphens may be used.
				The game will start in 5 seconds...
			`);
			await delay(5000);
			let userTurn = Boolean(Math.floor(Math.random() * 2));
			const words = [];
			let winner = null;
			let lastWord = startWord;
			while (!winner) {
				const player = userTurn ? msg.author : opponent;
				const letter = lastWord.charAt(lastWord.length - 1);
				await msg.say(`It's ${player}'s turn! The letter is **${letter}**.`);
				const filter = res => res.author.id === player.id && /[a-zA-Z]/i.test(res.content) && res.content.length < 50;
				const wordChoice = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: time * 1000
				});
				if (!wordChoice.size) {
					await msg.say('Time!');
					winner = userTurn ? opponent : msg.author;
					break;
				}
				const choice = wordChoice.first().content.toLowerCase();
				if (choice === 'challenge') {
					const checked = await this.verifyWord(lastWord);
					if (!checked) {
						await msg.say(`Caught red-handed! **${lastWord}** is not valid!`);
						winner = player;
						break;
					}
					await msg.say(`Sorry, **${lastWord}** is indeed valid!`);
					continue;
				}
				if (!choice.startsWith(letter) || words.includes(choice)) {
					await msg.say('Sorry! You lose!');
					winner = userTurn ? opponent : msg.author;
					break;
				}
				words.push(choice);
				lastWord = choice;
				userTurn = !userTurn;
			}
			this.playing.delete(msg.channel.id);
			if (!winner) return msg.say('Oh... No one won.');
			return msg.say(`The game is over! The winner is ${winner}!`);
		} catch (err) {
			this.playing.delete(msg.channel.id);
			throw err;
		}
	}

	async verifyWord(word) {
		try {
			const { body } = await request
				.get(`http://api.wordnik.com/v4/word.json/${word}/definitions`)
				.query({
					limit: 1,
					includeRelated: false,
					useCanonical: false,
					api_key: WORDNIK_KEY
				});
			if (!body.length || body[0].word.toLowerCase() !== word) return false;
			return true;
		} catch (err) {
			if (err.status === 404) return false;
			return null;
		}
	}
};
