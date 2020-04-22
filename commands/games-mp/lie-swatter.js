const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const Collection = require('@discordjs/collection');
const { delay } = require('../../util/Util');
const { SUCCESS_EMOJI_ID } = process.env;
const trueOptions = ['true', 'yes', 'the truth'];
const falseOptions = ['false', 'lie', 'no', 'a lie'];
const max = 100;
const min = 1;

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
			]
		});
	}

	async run(msg) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			const awaitedPlayers = await this.awaitPlayers(msg);
			let turn = 0;
			const pts = new Collection();
			for (const player of awaitedPlayers) {
				pts.set(player, {
					points: 0,
					id: player,
					user: this.client.users.cache.get(player)
				});
			}
			const questions = await this.fetchQuestions();
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
					return trueOptions.includes(answer) || falseOptions.includes(answer);
				};
				const msgs = await msg.channel.awaitMessages(filter, {
					max: pts.size,
					time: 30000
				});
				if (!msgs.size) {
					await msg.say(`No answers? Well, it was ${question.answer ? 'true' : 'a lie'}.`);
					continue;
				}
				const answers = msgs.map(res => {
					let answer;
					if (trueOptions.includes(res.content.toLowerCase())) answer = true;
					else if (falseOptions.includes(res.content.toLowerCase())) answer = false;
					return { answer, id: res.author.id };
				});
				const correct = answers.filter(answer => answer === question.answer);
				for (const answer of correct) {
					const player = pts.get(answer.id);
					if (correct.first().id === answer.id) player.pts += 75;
					else player.pts += 50;
				}
				await msg.say(stripIndents`
					It was... **${question.answer ? 'true' : 'a lie'}**!

					_Fastest Guess: ${correct.first().author.tag} (+75 pts)_

					${questions.length ? '_Next round starting in 5 seconds..._' : ''}
				`);
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
			const answer = question.correct_answer === 'True' ? true : false;
			return {
				question: decodeURIComponent(question.question),
				category: decodeURIComponent(question.category),
				answer
			};
		});
	}

	async awaitPlayers(msg) {
		await msg.say(`You can have at most 99 more players. To join, type \`join game\`.`);
		const joined = [];
		joined.push(msg.author.id);
		const filter = res => {
			if (res.author.bot) return false;
			if (joined.includes(res.author.id)) return false;
			if (res.content.toLowerCase() !== 'join game') return false;
			joined.push(res.author.id);
			res.react(SUCCESS_EMOJI_ID || '✅').catch(() => null);
			return true;
		};
		const verify = await msg.channel.awaitMessages(filter, { max: max - 1, time: 60000 });
		verify.set(msg.id, msg);
		if (verify.size < min) return false;
		return verify.map(player => player.author.id);
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
