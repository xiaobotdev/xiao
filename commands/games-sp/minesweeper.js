const Command = require('../../structures/Command');
const BombSweeper = require('bombsweeper.js');
const { stripIndents } = require('common-tags');
const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

module.exports = class MinesweeperCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'minesweeper',
			aliases: ['bombsweeper', 'mines', 'bombs', 'msweeper', 'minesweep', 'msweep'],
			group: 'games-sp',
			memberName: 'minesweeper',
			description: 'Play a game of Minesweeper.',
			args: [
				{
					key: 'size',
					prompt: 'What size board do you want to use?',
					type: 'integer',
					default: 9,
					max: 9,
					min: 3
				}
			]
		});
	}

	async run(msg, { size }) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			const game = new BombSweeper(size, size);
			game.PlaceBombs(size + 1);
			const taken = [];
			let win = null;
			game.onWin = () => { win = true; };
			game.onLose = () => { win = false; };
			while (!win) {
				await msg.say(stripIndents`
					${msg.author}, what coordinates do you pick (ex. 4,5)? Type \`end\` to forefeit.

					${this.displayBoard(game.board, game.mask)}
				`);
				const filter = res => {
					if (res.author.id !== msg.author.id) return false;
					const pick = res.content;
					if (pick.toLowerCase() === 'end') return true;
					const coordPicked = pick.match(/(\d), ?(\d)/i);
					if (!coordPicked) return false;
					const x = Number.parseInt(coordPicked[1], 10);
					const y = Number.parseInt(coordPicked[2], 10);
					if (game.mask[x - 1][y - 1]) return false;
					return true;
				};
				const turn = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 30000
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
				const coordPicked = choice.match(/(\d), ?(\d)/i)
				const x = Number.parseInt(coordPicked[1], 10);
				const y = Number.parseInt(coordPicked[2], 10);
				taken.push(`${x},${y}`);
				game.CheckCell(x - 1, y - 1);
			}
			this.client.games.delete(msg.channel.id);
			if (!win) return msg.say('Game ended due to inactivity.');
			return msg.say(stripIndents`
				${win ? 'Nice job! You win!' : 'Sorry... You lose.'}

				${this.displayBoard(game.board)}
			`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}

	displayBoard(board, mask) {
		let str = '';
		str += '⬛';
		str += nums.slice(0, board.length).join('');	
		str += '\n';
		for (let i = 0; i < board.length; i++) {
			str += nums[i];
			board[i].forEach((item, j) => {
				if (mask[i][j]) {
					if (item === '*') {
						str += '💣';
					} else if (item === 0) {
						str += '⬜';
					} else {
						str += nums[item - 1];
					}
				} else {
					str += '❓';
				}
			});
			str += '\n';
		}
		return str;
	}
};
