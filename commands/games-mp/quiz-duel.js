const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const Collection = require('@discordjs/collection');
const { delay, awaitPlayers, shuffle, reactIfAble } = require('../../util/Util');
const { SUCCESS_EMOJI_ID } = process.env;
const choices = ['A', 'B', 'C', 'D'];

module.exports = class QuizDuelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'quiz-duel',
			aliases: ['trivia-duel'],
			group: 'games-mp',
			memberName: 'quiz-duel',
			description: 'Answer a series of quiz questions against other opponents.',
			credit: [
				{
					name: 'Open Trivia DB',
					url: 'https://opentdb.com/',
					reason: 'API',
					reasonURL: 'https://opentdb.com/api_config.php'
				}
			],
			args: [
				{
					key: 'players',
					prompt: 'How many players are you expecting to have?',
					type: 'integer',
					min: 1,
					max: 100
				}
			]
		});
	}

	async run(msg, { players }) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			const awaitedPlayers = await awaitPlayers(msg, players, 1, this.client.blacklist.user);
			let turn = 0;
			const pts = new Collection();
			for (const player of awaitedPlayers) {
				pts.set(player, {
					points: 0,
					id: player,
					user: await this.client.users.fetch(player)
				});
			}
			const questions = await this.fetchQuestions();
			let lastTurnTimeout = false;
			while (questions.length) {
				++turn;
				const question = questions[0];
				questions.shift();
				await msg.say(stripIndents`
					**${turn}. ${question.category}**
					${question.question}
					${question.answers.map((answer, i) => `**${choices[i]}.** ${answer}`).join('\n')}
				`);
				const filter = res => {
					if (!awaitedPlayers.includes(res.author.id)) return false;
					const answer = res.content.toUpperCase();
					if (choices.includes(answer)) {
						reactIfAble(res, res.author, SUCCESS_EMOJI_ID, '✅');
						return true;
					}
					return false;
				};
				const msgs = await msg.channel.awaitMessages(filter, {
					max: pts.size,
					time: 30000
				});
				if (!msgs.size) {
					await msg.say(`No answers? Well, it was **${question.correct}**.`);
					if (lastTurnTimeout) {
						break;
					} else {
						lastTurnTimeout = true;
						continue;
					}
				}
				const answers = msgs.map(res => {
					const choice = choices.indexOf(res.content.toUpperCase());
					return {
						answer: question.answers[choice],
						id: res.author.id
					};
				});
				const correct = answers.filter(answer => answer.answer === question.correct);
				for (const answer of correct) {
					const player = pts.get(answer.id);
					if (correct[0].id === answer.id) player.points += 75;
					else player.points += 50;
				}
				await msg.say(stripIndents`
					It was... **${question.correct}**!

					_Fastest Guess: ${correct.length ? `${pts.get(correct[0].id).user.tag} (+75 pts)` : 'No One...'}_

					${questions.length ? '_Next round starting in 5 seconds..._' : ''}
				`);
				if (lastTurnTimeout) lastTurnTimeout = false;
				if (questions.length) await delay(5000);
			}
			this.client.games.delete(msg.channel.id);
			const winner = pts.sort((a, b) => b.points - a.points).first().user;
			return msg.say(stripIndents`
				Congrats, ${winner}!

				__**Top 10:**__
				${this.makeLeaderboard(pts).slice(0, 10).join('\n')}
			`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}

	async fetchQuestions() {
		const { body } = await request
			.get('https://opentdb.com/api.php')
			.query({
				amount: 7,
				type: 'multiple',
				encode: 'url3986'
			});
		if (!body.results) return this.fetchQuestions();
		const questions = body.results;
		return questions.map(question => {
			const answers = question.incorrect_answers.map(answer => decodeURIComponent(answer.toLowerCase()));
			const correct = decodeURIComponent(question.correct_answer.toLowerCase());
			answers.push(correct);
			return {
				question: decodeURIComponent(question.question),
				category: decodeURIComponent(question.category),
				answers: shuffle(answers),
				correct
			};
		});
	}

	makeLeaderboard(pts) {
		let i = 0;
		let previousPts = null;
		let positionsMoved = 1;
		return pts
			.sort((a, b) => b.points - a.points)
			.map(player => {
				if (previousPts === player.points) {
					positionsMoved++;
				} else {
					i += positionsMoved;
					positionsMoved = 1;
				}
				previousPts = player.points;
				return `**${i}.** ${player.user.tag} (${player.points} Point${player.points === 1 ? '' : 's'})`;
			});
	}
};
