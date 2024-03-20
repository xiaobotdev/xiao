const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const { verify } = require('../../util/Util');
const blankEmoji = '⬜';
const blockEmoji = '🚫';
const userEmoji = '❌';
const oppoEmoji = '⭕';
const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
const turnRegex = /^(\d+), ?(\d+)/i;

module.exports = class ObstructionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'obstruction',
			aliases: ['obstruct'],
			group: 'games-mp',
			memberName: 'obstruction',
			description: 'Play a game of Obstruction with another user.',
			guildOnly: true,
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to challenge?',
					type: 'user'
				},
				{
					key: 'size',
					prompt: 'What board size do you want to use?',
					type: 'integer',
					min: 6,
					max: 10,
					default: 6
				}
			]
		});
	}

	async run(msg, { opponent, size }) {
		if (opponent.bot) return msg.reply('Bots may not be played against.');
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
		if (this.client.blacklist.user.includes(opponent.id)) return msg.reply('This user is blacklisted.');
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			await msg.say(`${opponent}, do you accept this challenge?`);
			const verification = await verify(msg.channel, opponent);
			if (!verification) {
				this.client.games.delete(msg.channel.id);
				return msg.say('Looks like they declined...');
			}
			const board = this.generateBoard(size);
			let userTurn = true;
			let winner = null;
			let lastTurnTimeout = false;
			while (!winner) {
				const user = userTurn ? msg.author : opponent;
				await msg.say(stripIndents`
					${user}, at what coordinates do you want to place your piece (ex. 1,1)? Type \`end\` to forfeit.
					Every piece you place will obstruct the 8 pieces around it.

					${this.displayBoard(board)}
				`);
				const possibleMoves = this.possibleMoves(board);
				const turnFilter = res => {
					if (res.author.id !== user.id) return false;
					const pick = res.content;
					if (pick.toLowerCase() === 'end') return true;
					const coordPicked = pick.match(turnRegex);
					if (!coordPicked) return false;
					const x = Number.parseInt(coordPicked[1], 10);
					const y = Number.parseInt(coordPicked[2], 10);
					if (x > size || y > size || x < 1 || y < 1) return false;
					if (!possibleMoves.includes(`${x - 1},${y - 1}`)) return false;
					return true;
				};
				const turn = await msg.channel.awaitMessages({
					filter: turnFilter,
					max: 1,
					time: 60000
				});
				if (!turn.size) {
					await msg.say('Sorry, time is up!');
					if (lastTurnTimeout) {
						winner = 'time';
						break;
					} else {
						lastTurnTimeout = true;
						userTurn = !userTurn;
						continue;
					}
				}
				const choice = turn.first().content;
				if (choice.toLowerCase() === 'end') {
					winner = userTurn ? opponent : msg.author;
					break;
				}
				const matched = choice.match(turnRegex);
				const x = Number.parseInt(matched[1], 10) - 1;
				const y = Number.parseInt(matched[2], 10) - 1;
				board[y][x] = userTurn ? 'X' : 'O';
				if (board[y - 1]) {
					if (board[y - 1][x]) board[y - 1][x] = 'B';
					if (board[y - 1][x - 1]) board[y - 1][x - 1] = 'B';
					if (board[y - 1][x + 1]) board[y - 1][x + 1] = 'B';
				}
				if (board[y + 1]) {
					if (board[y + 1][x]) board[y + 1][x] = 'B';
					if (board[y + 1][x + 1]) board[y + 1][x + 1] = 'B';
					if (board[y + 1][x - 1]) board[y + 1][x - 1] = 'B';
				}
				if (board[y][x - 1]) board[y][x - 1] = 'B';
				if (board[y][x + 1]) board[y][x + 1] = 'B';
				userTurn = !userTurn;
				if (lastTurnTimeout) lastTurnTimeout = false;
				const oppoPossible = this.possibleMoves(board);
				if (!oppoPossible.length) {
					winner = userTurn ? opponent : msg.author;
					break;
				}
			}
			this.client.games.delete(msg.channel.id);
			if (winner === 'time') return msg.say('Game ended due to inactivity.');
			return msg.say(stripIndents`
				Congrats, ${winner}! Your opponent has no possible moves left!

				${this.displayBoard(board)}
			`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}

	possibleMoves(board) {
		const possibleMoves = [];
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board[i].length; j++) {
				if (board[i][j] === 'X' || board[i][j] === 'O' || board[i][j] === 'B') continue;
				possibleMoves.push(`${j},${i}`);
			}
		}
		return possibleMoves;
	}

	generateBoard(size) {
		const arr = [];
		for (let i = 0; i < size; i++) {
			const row = [];
			for (let j = 0; j < size; j++) row.push('NA');
			arr.push(row);
		}
		return arr;
	}

	displayBoard(board) {
		let str = '';
		str += '⬛';
		str += nums.slice(0, board.length).join('');
		str += '\n';
		for (let i = 0; i < board.length; i++) {
			str += nums[i];
			board[i].forEach(item => {
				if (item === 'X') str += userEmoji;
				else if (item === 'O') str += oppoEmoji;
				else if (item === 'B') str += blockEmoji;
				else str += blankEmoji;
			});
			str += '\n';
		}
		return str;
	}
};
