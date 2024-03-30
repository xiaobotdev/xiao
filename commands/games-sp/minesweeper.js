const Command = require('../../framework/Command');
const BombSweeper = require('bombsweeper.js');
const moment = require('moment');
require('moment-duration-format');
const { stripIndents } = require('common-tags');
const { removeFromArray, verify, fetchHSUserDisplay } = require('../../util/Util');
const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
const turnRegex = /^(flag )?(\d+)(-\d+)?, ?(\d+)(-\d+)?/i;

module.exports = class MinesweeperCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'minesweeper',
			aliases: ['bombsweeper', 'mines', 'bombs', 'msweeper', 'minesweep', 'msweep'],
			group: 'games-sp',
			memberName: 'minesweeper',
			description: 'Play a game of Minesweeper.',
			game: true,
			args: [
				{
					key: 'size',
					type: 'integer',
					default: 9,
					max: 10,
					min: 2
				}
			]
		});
	}

	async run(msg, { size }) {
		const game = new BombSweeper(size, size);
		game.PlaceBombs(size + 1); // eslint-disable-line new-cap
		let win = null;
		game.onWin = () => { win = true; };
		game.onLoss = () => { win = false; };
		const flagged = [];
		const startTime = new Date();
		let cheatMode = false;
		while (win === null) {
			const currentTime = moment.duration(new Date() - startTime).format('mm:ss');
			await msg.say(stripIndents`
				${msg.author}, what coordinates do you pick (ex. 4,5)? Type \`end\` to forfeit.
				Type \`flag <coordinates>\` to flag a spot as a bomb. To remove a flag, run it again.
				You can also use ranges to mark multiple spots (ex. 4-7,5 or 7,4-5).

				${this.displayBoard(game.board, game.mask, flagged, cheatMode)}
				**Total Mines:** ${size + 1} | **Flagged:** ${flagged.length} | **Time:** ${currentTime}
			`);
			const filter = res => {
				if (res.author.id !== msg.author.id) return false;
				const pick = res.content;
				if (pick.toLowerCase() === 'xyzzy' && !cheatMode) return true;
				if (pick.toLowerCase() === 'end') return true;
				const coordPicked = pick.match(turnRegex);
				if (!coordPicked) return false;
				const x = Number.parseInt(coordPicked[2], 10);
				const y = Number.parseInt(coordPicked[4], 10);
				if (x > size || y > size || x < 1 || y < 1) return false;
				if (game.mask[y - 1][x - 1]) return false;
				return true;
			};
			const turn = await msg.channel.awaitMessages({
				filter,
				max: 1,
				time: 120000
			});
			if (!turn.size) {
				await msg.say('Sorry, time is up!');
				break;
			}
			const choice = turn.first().content;
			if (choice.toLowerCase() === 'end') {
				win = false;
				break;
			}
			if (choice.toLowerCase() === 'xyzzy') {
				cheatMode = true;
				await msg.say('Cheat mode is now active. No high score will be saved.');
				continue;
			}
			const coordPicked = choice.match(turnRegex);
			const x = Number.parseInt(coordPicked[2], 10);
			const y = Number.parseInt(coordPicked[4], 10);
			const xRange = coordPicked[3] ? Math.abs(Number.parseInt(coordPicked[3], 10)) : null;
			const yRange = coordPicked[5] ? Math.abs(Number.parseInt(coordPicked[5], 10)) : null;
			const flag = Boolean(coordPicked[1]);
			if (xRange && yRange) {
				await msg.say('You cannot have both an X and Y range.');
				continue;
			}
			if ((yRange && flag) || (xRange && flag)) {
				await msg.say('You cannot flag a range.');
				continue;
			}
			if (xRange) {
				for (let i = x; i <= xRange; i++) {
					const keepGoing = await this.runResult(msg, game, i, y, flag, flagged, win);
					if (keepGoing === false) break;
					if (keepGoing === null) continue;
				}
			} else if (yRange) {
				for (let i = y; i <= yRange; i++) {
					const keepGoing = await this.runResult(msg, game, x, i, flag, flagged, win);
					if (keepGoing === false) break;
					if (keepGoing === null) continue;
				}
			} else {
				const keepGoing = await this.runResult(msg, game, x, y, flag, flagged, win);
				if (keepGoing === false) break;
				if (keepGoing === null) continue;
			}
		}
		const newScore = Date.now() - startTime;
		const highScoreGet = await this.client.redis.get(`minesweeper-${size}`);
		const highScore = highScoreGet ? Number.parseInt(highScoreGet, 10) : null;
		const highScoreUser = await this.client.redis.get(`minesweeper-${size}-user`);
		const scoreBeat = !cheatMode && win && (!highScore || highScore > newScore);
		const user = await fetchHSUserDisplay(this.client, highScoreUser);
		if (scoreBeat) {
			await this.client.redis.set(`minesweeper-${size}`, newScore);
			await this.client.redis.set(`minesweeper-${size}-user`, msg.author.id);
		}
		if (win === null) return msg.say('Game ended due to inactivity.');
		const newDisplayTime = moment.duration(newScore).format('mm:ss');
		const displayTime = moment.duration(highScore).format('mm:ss');
		return msg.say(stripIndents`
			${win ? `Nice job! You win! (Took ${newDisplayTime})` : 'Sorry... You lose.'}
			${scoreBeat ? `**New High Score!** Old:` : `High Score:`} ${displayTime} (Held by ${user})

			${this.displayBoard(game.board)}
		`);
	}

	async runResult(msg, game, x, y, flag, flagged, win) {
		if (flag) {
			if (flagged.includes(`${x - 1},${y - 1}`)) {
				removeFromArray(flagged, `${x - 1},${y - 1}`);
			} else {
				flagged.push(`${x - 1},${y - 1}`);
			}
		} else {
			if (flagged.includes(`${x - 1},${y - 1}`)) {
				await msg.say(`Are you sure you want to check (${x}, ${y})? You have it flagged.`);
				const verification = await verify(msg.channel, msg.author);
				if (!verification) {
					await msg.say('Okay, the spot will remain unchecked.');
					return null;
				}
			}
			game.CheckCell(x - 1, y - 1); // eslint-disable-line new-cap
			if (win === true || win === false) return false;
		}
		if (win === true || win === false) return false;
		return true;
	}

	displayBoard(board, mask, flagged, cheatMode = false) {
		let str = '';
		str += '⬛';
		str += nums.slice(0, board.length).join('');
		str += '\n';
		for (let i = 0; i < board.length; i++) {
			str += nums[i];
			board[i].forEach((item, j) => {
				if (cheatMode && item === '*') {
					str += '💣';
				} else if (!mask || mask[i][j]) {
					if (item === '*') {
						str += '💣';
					} else if (item === 0) {
						str += '⬜';
					} else {
						str += nums[item - 1];
					}
				} else if (flagged.includes(`${j},${i}`)) {
					str += '🚩';
				} else {
					str += '❓';
				}
			});
			str += '\n';
		}
		return str;
	}
};
