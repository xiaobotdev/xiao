const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { shuffle } = require('../../util/Util');
const { questions, houses, descriptions } = require('../../assets/json/sorting-hat');
const choices = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];

module.exports = class SortingHatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sorting-hat',
			aliases: ['sorting-hat-quiz', 'hogwarts', 'hogwarts-house'],
			group: 'games-sp',
			memberName: 'sorting-hat',
			description: 'Take a quiz to determine your Hogwarts house.',
			credit: [
				{
					name: 'Pottermore',
					url: 'https://my.pottermore.com/sorting',
					reason: 'Original Quiz'
				},
				{
					name: 'u/N1ffler',
					url: 'https://www.reddit.com/user/N1ffler/',
					reason: 'Sorting Hat Quiz Analysis Data',
					reasonURL: 'https://www.reddit.com/r/Pottermore/comments/44os14/pottermore_sorting_hat_quiz_analysis/'
				}
			]
		});
	}

	async run(msg) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
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
				if (!choice.size) {
					this.client.games.delete(msg.channel.id);
					return msg.say('Oh no, you ran out of time! Too bad.');
				}
				const answer = answers[choices.indexOf(choice.first().content.toUpperCase())];
				for (const [house, amount] of Object.entries(answer.points)) points[house] += amount;
				++turn;
			}
			const houseResult = Object.keys(points).filter(h => points[h] > 0).sort((a, b) => points[b] - points[a]);
			this.client.games.delete(msg.channel.id);
			const totalPoints = houseResult.reduce((a, b) => a + points[b], 0);
			return msg.say(stripIndents`
				You are a member of... **${houses[houseResult[0]]}**!
				_${descriptions[houseResult[0]]}_

				${houseResult.map(house => `${houses[house]}: ${Math.round((points[house] / totalPoints) * 100)}%`).join('\n')}
			`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}
};
