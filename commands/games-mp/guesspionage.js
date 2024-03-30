const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const { Collection } = require('@discordjs/collection');
const { delay, awaitPlayers, reactIfAble } = require('../../util/Util');
const questions = require('../../assets/json/guesspionage');
const { SUCCESS_EMOJI_ID } = process.env;
const guesses = ['much higher', 'higher', 'lower', 'much lower'];
const max = 8;
const min = 2;

module.exports = class GuesspionageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'guesspionage',
			group: 'games-mp',
			memberName: 'guesspionage',
			description: 'Tests your knowledge of humans as you guess how people responded to poll questions.',
			guildOnly: true,
			credit: [
				{
					name: 'Jackbox Games',
					url: 'https://www.jackboxgames.com/',
					reason: 'Original "Guesspionage" Game',
					reasonURL: 'https://www.jackboxgames.com/guesspionage/'
				},
				{
					name: 'Playstation Trophies',
					url: 'https://www.playstationtrophies.org/',
					reason: 'Question Data',
					// eslint-disable-next-line max-len
					reasonURL: 'https://www.playstationtrophies.org/game/the-jackbox-party-pack-3/trophy/157520-Guesspionage--Perfect-Surveillance.html'
				},
				{
					name: 'TrueAchievements',
					url: 'https://www.trueachievements.com/',
					reason: 'Question Data',
					reasonURL: 'https://www.trueachievements.com/forum/viewthread.aspx?tid=850920'
				}
			],
			args: [
				{
					key: 'players',
					type: 'integer',
					min,
					max
				}
			]
		});
	}

	async run(msg, { players }) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			const awaitedPlayers = await awaitPlayers(msg, players, min, this.client.blacklist.user);
			if (!awaitedPlayers) {
				this.client.games.delete(msg.channel.id);
				return msg.say('Game could not be started...');
			}
			let turn = 0;
			const pts = new Collection();
			for (const player of awaitedPlayers) {
				pts.set(player, {
					points: 0,
					id: player,
					user: await this.client.users.fetch(player)
				});
			}
			const used = [];
			const userTurn = awaitedPlayers.slice(0);
			let lastTurnTimeout = false;
			while (userTurn.length) {
				++turn;
				const mainUser = pts.get(userTurn[0]).user;
				userTurn.shift();
				const valid = questions.filter(
					question => !used.includes(question.text) && (msg.channel.nsfw ? true : !question.nsfw)
				);
				const question = valid[Math.floor(Math.random() * valid.length)];
				used.push(question.text);
				await msg.say(stripIndents`
					**${turn}.** ${question.text}

					${mainUser}, what percentage do you guess?
				`);
				const initialGuessFilter = res => {
					if (res.author.id !== mainUser.id) return false;
					const int = Number.parseInt(res.content, 10);
					return int >= 0 && int <= 100;
				};
				const initialGuess = await msg.channel.awaitMessages({
					filter: initialGuessFilter,
					max: 1,
					time: 30000
				});
				if (!initialGuess.size) {
					await msg.say('Hmm... No guess? I guess you\'re getting skipped.');
					continue;
				}
				const guess = Number.parseInt(initialGuess.first().content, 10);
				await msg.say(stripIndents`
					**${guess}%**

					Alright, everyone else, do you think the _actual_ percentage is \`higher\` or \`lower\`?
					You can also guess \`much higher\` or \`much lower\` for double points if their answer is 15% off.
				`);
				const guessed = [];
				const everyoneElseFilter = res => {
					if (res.author.id === mainUser.id) return false;
					if (guessed.includes(res.author.id)) return false;
					if (!awaitedPlayers.includes(res.author.id)) return false;
					if (!guesses.includes(res.content.toLowerCase())) return false;
					guessed.push(res.author.id);
					reactIfAble(res, res.author, SUCCESS_EMOJI_ID, '✅');
					return true;
				};
				const everyoneElse = await msg.channel.awaitMessages({
					filter: everyoneElseFilter,
					max: awaitedPlayers.length - 1,
					time: 30000
				});
				if (!everyoneElse.size) {
					if (lastTurnTimeout) {
						await msg.say('Game ended due to inactivity.');
						break;
					} else {
						await msg.say('Come on guys, get in the game!');
						lastTurnTimeout = true;
						continue;
					}
				}
				const higherLower = everyoneElse.map(res => ({ guess: res.content.toLowerCase(), id: res.author.id }));
				for (const answer of higherLower) {
					const uGuess = answer.guess;
					if (uGuess === 'higher' && guess < question.answer) {
						pts.get(answer.id).points += 1000;
					} else if (uGuess === 'lower' && guess > question.answer) {
						pts.get(answer.id).points += 1000;
					} else if (uGuess === 'much higher' && guess < question.answer && question.answer - guess >= 15) {
						pts.get(answer.id).points += 2000;
					} else if (uGuess === 'much lower' && guess > question.answer && guess - question.answer >= 15) {
						pts.get(answer.id).points += 2000;
					}
				}
				const diff = Math.abs(question.answer - guess);
				if (diff <= 30) pts.get(mainUser.id).points += 3000 - (diff * 100);
				await msg.say(stripIndents`
					The actual answer was... **${question.answer}%**!

					__**Leaderboard:**__
					${this.makeLeaderboard(pts).join('\n')}

					${userTurn.length ? '_Next round starting in 10 seconds..._' : ''}
				`);
				if (lastTurnTimeout) lastTurnTimeout = false;
				if (userTurn.length) await delay(10000);
			}
			this.client.games.delete(msg.channel.id);
			const winner = pts.sort((a, b) => b.points - a.points).first().user;
			return msg.say(`Congrats, ${winner}!`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
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
