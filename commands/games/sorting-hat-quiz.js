const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { shuffle } = require('../../util/Util');
const { questions, houses, descriptions } = require('../../assets/json/sorting-hat-quiz');
const choices = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];

module.exports = class SortingHatQuizCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sorting-hat-quiz',
			aliases: ['sorting-hat', 'pottermore', 'hogwarts'],
			group: 'games',
			memberName: 'sorting-hat-quiz',
			description: 'Take a quiz to determine your Hogwarts house.'
		});

		this.playing = new Set();
	}

	async run(msg) {
		if (this.playing.has(msg.channel.id)) return msg.reply('Only one quiz may be occurring per channel.');
		this.playing.add(msg.channel.id);
		try {
			const points = {
				g: 0,
				s: 0,
				h: 0,
				r: 0
			};
			const blacklist = [];
			const questionNums = ['2', '3', '4', '5', '6', '7'];
			let turn = 1;
			while (turn < 9) {
				let question;
				if (turn === 1) {
					question = questions.first[Math.floor(Math.random() * questions.first.length)];
				} else if (turn === 8) {
					question = questions.last[Math.floor(Math.random() * questions.last.length)];
				} else {
					const possible = questionNums.filter(num => !blacklist.includes(num));
					const value = possible[Math.floor(Math.random() * possible.length)];
					const group = questions[value];
					blacklist.push(value);
					question = group[Math.floor(Math.random() * group.length)];
				}
				const answers = shuffle(question.answers);
				await msg.say(stripIndents`
					**${turn}.** ${question.text}
					${answers.map((answer, i) => `- **${choices[i]}.** ${answer.text}`).join('\n')}
				`);
				const filter = res =>
					res.author.id === msg.author.id && choices.slice(0, answers.length).includes(res.content.toUpperCase());
				const choice = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 120000
				});
				if (!choice.size) return msg.say('Oh no, you ran out of time! Too bad.');
				const answer = answers[choices.indexOf(choice.first().content.toUpperCase())];
				for (const [house, amount] of Object.entries(answer.points)) points[house] += amount;
				++turn;
			}
			const house = Object.keys(points).sort((a, b) => points[b] - points[a])[0];
			this.playing.delete(msg.channel.id);
			return msg.say(stripIndents`
				You are a member of... **${houses[house]}**!
				_${descriptions[house]}_
			`);
		} catch (err) {
			this.playing.delete(msg.channel.id);
			throw err;
		}
	}
};
