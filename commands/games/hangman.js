const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const words = require('../../assets/json/hangman');

module.exports = class HangmanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hangman',
			group: 'games',
			memberName: 'hangman',
			description: 'Prevent a man from being hanged by guessing a word as fast as you can.'
		});

		this.playing = new Set();
	}

	async run(msg) { // eslint-disable-line complexity
		if (this.playing.has(msg.channel.id)) return msg.reply('Only one game may be occurring per channel.');
		this.playing.add(msg.channel.id);
		try {
			const word = words[Math.floor(Math.random() * words.length)].toLowerCase();
			let points = 0;
			let displayText = null;
			let guessed = false;
			const confirmation = [];
			const incorrect = [];
			const display = new Array(word.length).fill('_');
			while (word.length !== confirmation.length && points < 6) {
				await msg.say(stripIndents`
					${displayText === null ? 'Here we go!' : displayText ? 'Good job!' : 'Nope!'}
					\`${display.join(' ')}\`. Which letter do you choose?
					Incorrect Tries: ${incorrect.join(', ') || 'None'}
					\`\`\`
					___________
					|     |
					|     ${points > 0 ? 'O' : ''}
					|    ${points > 2 ? '—' : ' '}${points > 1 ? '|' : ''}${points > 3 ? '—' : ''}
					|    ${points > 4 ? '/' : ''} ${points > 5 ? '\\' : ''}
					===========
					\`\`\`
				`);
				const filter = res => {
					const choice = res.content.toLowerCase();
					return res.author.id === msg.author.id && !confirmation.includes(choice) && !incorrect.includes(choice);
				};
				const guess = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 30000
				});
				if (!guess.size) {
					await msg.say('Sorry, time is up!');
					break;
				}
				const choice = guess.first().content.toLowerCase();
				if (choice === 'end') break;
				if (choice.length > 1 && choice === word) {
					guessed = true;
					break;
				} else if (word.includes(choice)) {
					displayText = true;
					for (let i = 0; i < word.length; i++) {
						if (word.charAt(i) !== choice) continue; // eslint-disable-line max-depth
						confirmation.push(word.charAt(i));
						display[i] = word.charAt(i);
					}
				} else {
					displayText = false;
					if (choice.length === 1) incorrect.push(choice);
					points++;
				}
			}
			this.playing.delete(msg.channel.id);
			if (word.length === confirmation.length || guessed) return msg.say(`You won, it was ${word}!`);
			return msg.say(`Too bad... It was ${word}...`);
		} catch (err) {
			this.playing.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
