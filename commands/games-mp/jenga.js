const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const { verify } = require('../../util/Util');
const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

module.exports = class JengaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'jenga',
			group: 'games-mp',
			memberName: 'jenga',
			description: 'Play a game of Jenga with another user or the AI.',
			game: true,
			credit: [
				{
					name: 'Jenga',
					url: 'https://jenga.com/',
					reason: 'Original Game'
				}
			],
			args: [
				{
					key: 'opponent',
					type: 'user'
				}
			]
		});
	}

	async run(msg, { opponent }) {
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
		if (this.client.blacklist.user.includes(opponent.id)) return msg.reply('This user is blacklisted.');
		if (!opponent.bot) {
			await msg.say(`${opponent}, do you accept this challenge?`);
			const verification = await verify(msg.channel, opponent);
			if (!verification) return msg.say('Looks like they declined...');
		}
		const board = [true, true, true, true, true, true, true, true, true, true];
		let userTurn = true;
		let winner = null;
		let wonByFinalPiece = false;
		let lastTurnTimeout = false;
		let i;
		while (!winner && board.length) {
			const user = userTurn ? msg.author : opponent;
			if (opponent.bot && !userTurn) {
				i = Math.floor(Math.random() * board.length);
			} else {
				const text = stripIndents`
					${user}, which block do you want to remove? Type \`end\` to forfeit.
					Each block you go lower on the tower, the more likely the tower falls.
				`;
				await msg.say(`${text}\n\n${this.displayBoard(board)}`);
				const pickFilter = res => {
					if (res.author.id !== user.id) return false;
					const choice = res.content;
					if (choice.toLowerCase() === 'end') return true;
					const j = Number.parseInt(choice, 10) - 1;
					return board[j];
				};
				const turn = await msg.channel.awaitMessages({
					filter: pickFilter,
					max: 1,
					time: 60000
				});
				if (!turn.size) {
					if (lastTurnTimeout) {
						winner = 'time';
						break;
					} else {
						await msg.say('Sorry, time is up!');
						lastTurnTimeout = true;
						userTurn = !userTurn;
						continue;
					}
				}
				const choice = turn.first().content;
				const picked = Number.parseInt(choice, 10);
				if (choice.toLowerCase() === 'end') {
					winner = userTurn ? opponent : msg.author;
					break;
				}
				i = picked - 1;
			}
			if (board.length === 1) {
				winner = userTurn ? msg.author : opponent;
				wonByFinalPiece = true;
			}
			const fell = Math.floor(Math.random() * ((board.length + 1) - (i + 1)));
			if (!fell) {
				winner = userTurn ? opponent : msg.author;
				break;
			}
			await msg.say(`${opponent.bot && !userTurn ? `I pick ${i + 1}. ` : ''}Thankfully, the tower stands.`);
			board.shift();
			userTurn = !userTurn;
			if (lastTurnTimeout) lastTurnTimeout = false;
		}
		if (winner === 'time') return msg.say('Game ended due to inactivity.');
		let text;
		if (wonByFinalPiece) {
			text = opponent.bot && !userTurn
				? 'I pick up the last piece and win!'
				: `${winner} picks up the last piece, winning the game!`;
		} else {
			text = `${opponent.bot && !userTurn ? `I pick ${i + 1}, a` : 'A'}nd the tower topples!`;
		}
		return msg.say(stripIndents`
			${text}
			${winner ? `Congrats, ${winner}!` : 'Looks like it\'s a draw...'}
		`);
	}

	displayBoard(board) {
		return board.map((b, i) => `${i % 2 ? '          ' : nums[i]}🟫🟫🟫🟫🟫${i % 2 ? nums[i] : ''}`).join('\n');
	}
};
