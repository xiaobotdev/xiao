const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { verify, list } = require('../../util/Util');
const colors = require('../../assets/json/domineering');
const blankEmoji = '⬜';
const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
const turnRegex = /^(v|h) ?(\d+), ?(\d+)/i;

module.exports = class CramCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cram',
			aliases: ['plugg', 'dots-and-pairs'],
			group: 'games-mp',
			memberName: 'cram',
			description: 'Play a game of Cram with another user.',
			guildOnly: true,
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to challenge?',
					type: 'user'
				},
				{
					key: 'color',
					prompt: `What color do you want to be? Either ${list(Object.keys(colors), 'or')}.`,
					type: 'string',
					oneOf: Object.keys(colors),
					parse: color => color.toLowerCase()
				},
				{
					key: 'size',
					prompt: 'What board size do you want to use?',
					type: 'integer',
					min: 3,
					max: 10,
					default: 5
				}
			]
		});
	}

	async run(msg, { opponent, color, size }) {
		if (opponent.bot) return msg.reply('Bots may not be played against.');
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		const userEmoji = colors[color];
		let oppoEmoji = userEmoji === colors.blue ? colors.red : colors.blue;
		try {
			const available = Object.keys(colors).filter(clr => color !== clr);
			await msg.say(`${opponent}, do you accept this challenge?`);
			const verification = await verify(msg.channel, opponent);
			if (!verification) {
				this.client.games.delete(msg.channel.id);
				return msg.say('Looks like they declined...');
			}
			await msg.say(`${opponent}, what color do you want to be? Either ${list(available, 'or')}.`);
			const filter = res => {
				if (res.author.id !== opponent.id) return false;
				return available.includes(res.content.toLowerCase());
			};
			const p2Color = await msg.channel.awaitMessages(filter, {
				max: 1,
				time: 30000
			});
			if (p2Color.size) oppoEmoji = colors[p2Color.first().content.toLowerCase()];
			const board = this.generateBoard(size);
			let userTurn = true;
			let winner = null;
			let lastTurnTimeout = false;
			while (!winner) {
				const user = userTurn ? msg.author : opponent;
				await msg.say(stripIndents`
					${user}, at what coordinates do you want to place your block? Type \`end\` to forefeit.
					You must also choose a direction. (ex. v1,1 or h3,4).

					${this.displayBoard(board, userEmoji, oppoEmoji)}
				`);
				const possibleMoves = this.possibleMoves(board);
				const colorFilter = res => {
					if (res.author.id !== user.id) return false;
					const pick = res.content;
					if (pick.toLowerCase() === 'end') return true;
					const coordPicked = pick.match(turnRegex);
					if (!coordPicked) return false;
					const direction = coordPicked[1].toLowerCase();
					const x = Number.parseInt(coordPicked[2], 10);
					const y = Number.parseInt(coordPicked[3], 10);
					if (x > size || y > size || x < 1 || y < 1) return false;
					if (!possibleMoves.includes(`${direction}${x - 1},${y - 1}`)) return false;
					return true;
				};
				const turn = await msg.channel.awaitMessages(colorFilter, {
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
				const direction = matched[1].toLowerCase();
				const x = Number.parseInt(matched[2], 10);
				const y = Number.parseInt(matched[3], 10);
				board[y - 1][x - 1] = userTurn ? 'U' : 'O';
				board[direction === 'v' ? y : y - 1][direction === 'v' ? x - 1 : x] = userTurn ? 'U' : 'O';
				userTurn = !userTurn;
				if (lastTurnTimeout) lastTurnTimeout = false;
				const oppoPossible = this.possibleMoves(board, userTurn);
				if (!oppoPossible.length) {
					winner = userTurn ? opponent : msg.author;
					break;
				}
			}
			this.client.games.delete(msg.channel.id);
			if (winner === 'time') return msg.say('Game ended due to inactivity.');
			return msg.say(stripIndents`
				Congrats, ${winner}! Your opponent has no possible moves left!

				${this.displayBoard(board, userEmoji, oppoEmoji)}
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
				if (board[i][j]) continue;
				if (board[i + 1] && board[i + 1][j] === null) possibleMoves.push(`v${j},${i}`);
				if (board[i][j + 1] === null) possibleMoves.push(`h${j},${i}`);
			}
		}
		return possibleMoves;
	}

	generateBoard(size) {
		const arr = [];
		for (let i = 0; i < size; i++) {
			const row = [];
			for (let j = 0; j < size; j++) row.push(null);
			arr.push(row);
		}
		return arr;
	}

	displayBoard(board, userColor, oppoColor) {
		let str = '';
		str += '⬛';
		str += nums.slice(0, board.length).join('');
		str += '\n';
		for (let i = 0; i < board.length; i++) {
			str += nums[i];
			board[i].forEach(item => {
				if (item === 'U') str += userColor;
				else if (item === 'O') str += oppoColor;
				else str += blankEmoji;
			});
			str += '\n';
		}
		return str;
	}
};
