const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { Collection } = require('@discordjs/collection');
const { delay, awaitPlayers, reactIfAble } = require('../../util/Util');
const { SUCCESS_EMOJI_ID } = process.env;
const trueOptions = ['true', 'yes', 'the truth', 't', 'tru', 'tr', 'y', 'ye'];
const falseOptions = ['false', 'lie', 'no', 'a lie', 'f', 'fals', 'fal', 'fa', 'n', 'l'];

module.exports = class LieSwatterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lie-swatter',
			group: 'games-mp',
			memberName: 'lie-swatter',
			description: 'Players are given a fact and must quickly decide if it\'s True or a Lie.',
			credit: [
				{
					name: 'Jackbox Games',
					url: 'https://www.jackboxgames.com/',
					reason: 'Original "Lie Swatter" Game',
					reasonURL: 'https://www.jackboxgames.com/lie-swatter/'
				},
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

					_Is it True or is it a Lie?_
				`);
				const filter = res => {
					if (!awaitedPlayers.includes(res.author.id)) return false;
					const answer = res.content.toLowerCase();
					if (trueOptions.includes(answer) || falseOptions.includes(answer)) {
						reactIfAble(res, res.author, SUCCESS_EMOJI_ID, '✅');
						return true;
					}
					return false;
				};
				const msgs = await msg.channel.awaitMessages({
					filter,
					max: pts.size,
					time: 30000
				});
				if (!msgs.size) {
					await msg.say(`No answers? Well, it was ${question.answer ? 'true' : 'a lie'}.`);
					if (lastTurnTimeout) {
						break;
					} else {
						lastTurnTimeout = true;
						continue;
					}
				}
				const answers = msgs.map(res => {
					let answer;
					if (trueOptions.includes(res.content.toLowerCase())) answer = true;
					else if (falseOptions.includes(res.content.toLowerCase())) answer = false;
					return { answer, id: res.author.id };
				});
				const correct = answers.filter(answer => answer.answer === question.answer);
				for (const answer of correct) {
					const player = pts.get(answer.id);
					if (correct[0].id === answer.id) player.points += 75;
					else player.points += 50;
				}
				await msg.say(stripIndents`
					It was... **${question.answer ? 'true' : 'a lie'}**!

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
				type: 'boolean',
				encode: 'url3986'
			});
		if (!body.results) return this.fetchQuestions();
		const questions = body.results;
		return questions.map(question => {
			const answer = question.correct_answer === 'True';
			return {
				question: decodeURIComponent(question.question),
				category: decodeURIComponent(question.category),
				answer
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
