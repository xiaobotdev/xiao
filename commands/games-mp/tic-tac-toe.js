const Command = require('../../structures/Command');
const tictactoe = require('tictactoe-minimax-ai');
const { stripIndents } = require('common-tags');
const { verify } = require('../../util/Util');

module.exports = class TicTacToeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tic-tac-toe',
			group: 'games-mp',
			memberName: 'tic-tac-toe',
			description: 'Play a game of tic-tac-toe with another user.',
			guildOnly: true,
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
					choice = tictactoe.bestMove(this.convertBoard(sides), { computer: 'o', opponent: 'x' });
				} else {
					await msg.say(stripIndents`
						${user}, which side do you pick? Type \`end\` to forefeit.
						\`\`\`
						${sides[0]} | ${sides[1]} | ${sides[2]}
						—————————
						${sides[3]} | ${sides[4]} | ${sides[5]}
						—————————
						${sides[6]} | ${sides[7]} | ${sides[8]}
						\`\`\`
					`);
					const filter = res => {
						if (res.author.id !== user.id) return false;
						const choice = res.content;
						if (choice.toLowerCase() === 'end') return true;
						return sides.includes(choice) && !taken.includes(choice);
					};
					const turn = await msg.channel.awaitMessages(filter, {
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
				if (this.verifyWin(sides)) winner = userTurn ? msg.author : opponent;
				if (lastTurnTimeout) lastTurnTimeout = false;
				userTurn = !userTurn;
			}
			this.client.games.delete(msg.channel.id);
			if (winner === 'time') return msg.say('Game ended due to inactivity.');
			return msg.say(winner ? `Congrats, ${winner}!` : 'Oh... The cat won.');
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}

	verifyWin(sides) {
		const evaluated = tictactoe.boardEvaluate(this.convertBoard(sides), { computer: 'o', opponent: 'x '});
		if (evaluated === 'win' || evaluated === 'loss' || evaluated === 'tie') return true;
		return false;
	}

	convertBoard(board) {
		const newBoard = [];
		for (const piece of board) {
			if (piece === 'X') newBoard.push('x');
			if (piece === 'O') newBoard.push('o');
			newBoard.push('_');
		}
		return newBoard;
	}
};
