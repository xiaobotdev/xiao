const Command = require('../../framework/Command');
const { default: { ComputerMove } } = require('tictactoe-minimax-ai');
const { stripIndents } = require('common-tags');
const { verify } = require('../../util/Util');
const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

module.exports = class TicTacToeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tic-tac-toe',
			aliases: ['ttt', 'tic-tac'],
			group: 'games-mp',
			memberName: 'tic-tac-toe',
			description: 'Play a game of tic-tac-toe with another user or the AI.',
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to challenge? To play against AI, choose me.',
					type: 'user'
				}
			]
		});
	}

	async run(msg, { opponent }) {
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
		if (this.client.blacklist.user.includes(opponent.id)) return msg.reply('This user is blacklisted.');
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			if (!opponent.bot) {
				await msg.say(`${opponent}, do you accept this challenge?`);
				const verification = await verify(msg.channel, opponent);
				if (!verification) {
					this.client.games.delete(msg.channel.id);
					return msg.say('Looks like they declined...');
				}
			}
			const sides = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
			const taken = [];
			let userTurn = true;
			let winner = null;
			let lastTurnTimeout = false;
			while (!winner && taken.length < 9) {
				const user = userTurn ? msg.author : opponent;
				const sign = userTurn ? 'X' : 'O';
				let choice;
				if (opponent.bot && !userTurn) {
					// eslint-disable-next-line new-cap
					choice = ComputerMove(this.convertBoard(sides), { aiPlayer: 'O', huPlayer: 'X' }, 'Hard');
				} else {
					await msg.say(stripIndents`
						${user}, which side do you pick? Type \`end\` to forfeit.

						${this.displayBoard(sides)}
					`);
					const filter = res => {
						if (res.author.id !== user.id) return false;
						const pick = res.content;
						if (pick.toLowerCase() === 'end') return true;
						return sides.includes(pick) && !taken.includes(pick);
					};
					const turn = await msg.channel.awaitMessages({
						filter,
						max: 1,
						time: 30000
					});
					if (!turn.size) {
						await msg.say('Sorry, time is up!');
						if (lastTurnTimeout) {
							winner = 'time';
							break;
						} else {
							userTurn = !userTurn;
							lastTurnTimeout = true;
							continue;
						}
					}
					choice = turn.first().content;
					if (choice.toLowerCase() === 'end') {
						winner = userTurn ? opponent : msg.author;
						break;
					}
				}
				sides[opponent.bot && !userTurn ? choice : Number.parseInt(choice, 10) - 1] = sign;
				taken.push(choice);
				const win = this.verifyWin(sides, msg.author, opponent);
				if (win) winner = win;
				if (lastTurnTimeout) lastTurnTimeout = false;
				userTurn = !userTurn;
			}
			this.client.games.delete(msg.channel.id);
			if (winner === 'time') return msg.say('Game ended due to inactivity.');
			return msg.say(stripIndents`
				${winner === 'tie' ? 'Oh... The cat won.' : `Congrats, ${winner}!`}

				${this.displayBoard(sides)}
			`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}

	playerWon(board, player) {
		if (
			(board[0] === player && board[1] === player && board[2] === player)
			|| (board[3] === player && board[4] === player && board[5] === player)
			|| (board[6] === player && board[7] === player && board[8] === player)
			|| (board[0] === player && board[3] === player && board[6] === player)
			|| (board[1] === player && board[4] === player && board[7] === player)
			|| (board[2] === player && board[5] === player && board[8] === player)
			|| (board[0] === player && board[4] === player && board[8] === player)
			|| (board[2] === player && board[4] === player && board[6] === player)
		) return true;
		return false;
	}

	verifyWin(board, player1, player2) {
		if (this.playerWon(board, player1)) return player1;
		if (this.playerWon(board, player2)) return player2;
		return null;
	}

	convertBoard(board) {
		const newBoard = [];
		let num = 0;
		for (const piece of board) {
			if (piece === 'X') {
				newBoard.push('X');
			} else if (piece === 'O') {
				newBoard.push('O');
			} else {
				newBoard.push(num);
			}
			num++;
		}
		return newBoard;
	}

	displayBoard(board) {
		let str = '';
		for (let i = 0; i < board.length; i++) {
			if (board[i] === 'X') {
				str += '❌';
			} else if (board[i] === 'O') {
				str += '⭕';
			} else {
				str += nums[i];
			}
			if (i % 3 === 2) str += '\n';
		}
		return str;
	}
};
