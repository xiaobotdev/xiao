const Command = require('../../structures/Command');
const { Connect4AI } = require('connect4-ai');
const { stripIndents } = require('common-tags');
const emojiRegex = require('emoji-regex/RGI_Emoji.js');
const { verify, list } = require('../../util/Util');
const { LOADING_EMOJI_ID } = process.env;
const blankEmoji = '⚪';
const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'];
const colors = require('../../assets/json/connect-four');
colors.loading = `<a:loading:${LOADING_EMOJI_ID}>`;

module.exports = class ConnectFourCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'connect-four',
			aliases: ['connect-4', 'c4'],
			group: 'games-mp',
			memberName: 'connect-four',
			description: 'Play a game of Connect Four with another user or the AI.',
			credit: [
				{
					name: 'Hasbro',
					url: 'https://shop.hasbro.com/en-us',
					reason: 'Original "Connect Four" Game'
				}
			],
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to challenge? To play against AI, choose me.',
					type: 'user'
				},
				{
					key: 'color',
					prompt: `What color do you want to be? Either an emoji or one of ${list(Object.keys(colors), 'or')}.`,
					type: 'default-emoji|string',
					validate: color => {
						const hasEmoji = new RegExp(`^(?:${emojiRegex().source})$`).test(color);
						if (!hasEmoji && !colors[color.toLowerCase()]) {
							return `Please enter an emoji or one of the following: ${list(Object.keys(colors), 'or')}.`;
						}
						return true;
					},
					parse: color => colors[color.toLowerCase()] || color
				}
			]
		});
	}

	async run(msg, { opponent, color }) {
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		const playerOneEmoji = colors[color];
		let playerTwoEmoji = color === 'yellow' ? colors.red : colors.yellow;
		try {
			const available = Object.keys(colors).filter(clr => {
				if (color === 'blue' && clr === 'purple') return false;
				if (color === 'purple' && clr === 'blue') return false;
				return color !== clr;
			});
			if (opponent.bot) {
				playerTwoEmoji = colors[available[Math.floor(Math.random() * available.length)]];
			} else {
				await msg.say(`${opponent}, do you accept this challenge?`);
				const verification = await verify(msg.channel, opponent);
				if (!verification) {
					this.client.games.delete(msg.channel.id);
					return msg.say('Looks like they declined...');
				}
				await msg.say(
					`${opponent}, what color do you want to be? Either an emoji or one of ${list(available, 'or')}.`
				);
				const filter = res => {
					if (res.author.id !== opponent.id) return false;
					const hasEmoji = new RegExp(`^(?:${emojiRegex().source})$`).test(value);
					return hasEmoji || available.includes(res.content.toLowerCase());
				}
				const p2Color = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 30000
				});
				if (p2Color.size) {
					const choice = p2Color.first().content.toLowerCase();
					playerTwoEmoji = colors[choice] || choice;
				}
			}
			let AIEngine = null;
			if (opponent.bot) AIEngine = new Connect4AI();
			const board = this.generateBoard();
			let userTurn = true;
			let winner = null;
			const colLevels = [5, 5, 5, 5, 5, 5, 5];
			let lastTurnTimeout = false;
			let lastMove = 'None';
			while (!winner && board.some(row => row.includes(null))) {
				const user = userTurn ? msg.author : opponent;
				const sign = userTurn ? 'user' : 'oppo';
				let i;
				if (opponent.bot && !userTurn) {
					i = AIEngine.playAI('hard');
					lastMove = i + 1;
				} else {
					await msg.say(stripIndents`
						${user}, which column do you pick? Type \`end\` to forefeit.
						${AIEngine ? `I placed mine in **${lastMove}**.` : `Previous Move: **${lastMove}**`}

						${this.displayBoard(board, playerOneEmoji, playerTwoEmoji)}
						${nums.join('')}
					`);
					const pickFilter = res => {
						if (res.author.id !== user.id) return false;
						const choice = res.content;
						if (choice.toLowerCase() === 'end') return true;
						const j = Number.parseInt(choice, 10) - 1;
						return board[colLevels[j]] && board[colLevels[j]][j] !== undefined;
					};
					const turn = await msg.channel.awaitMessages(pickFilter, {
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
					i = Number.parseInt(choice, 10) - 1;
					if (AIEngine) AIEngine.play(i);
					lastMove = i + 1;
				}
				board[colLevels[i]][i] = sign;
				colLevels[i]--;
				if (this.verifyWin(board)) winner = userTurn ? msg.author : opponent;
				if (lastTurnTimeout) lastTurnTimeout = false;
				userTurn = !userTurn;
			}
			this.client.games.delete(msg.channel.id);
			if (winner === 'time') return msg.say('Game ended due to inactivity.');
			return msg.say(stripIndents`
				${winner ? `Congrats, ${winner}!` : 'Looks like it\'s a draw...'}
				Final Move: **${lastMove}**

				${this.displayBoard(board, playerOneEmoji, playerTwoEmoji)}
				${nums.join('')}
			`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}

	checkLine(a, b, c, d) {
		return (a !== null) && (a === b) && (a === c) && (a === d);
	}

	verifyWin(bd) {
		for (let r = 0; r < 3; r++) {
			for (let c = 0; c < 7; c++) {
				if (this.checkLine(bd[r][c], bd[r + 1][c], bd[r + 2][c], bd[r + 3][c])) return bd[r][c];
			}
		}
		for (let r = 0; r < 6; r++) {
			for (let c = 0; c < 4; c++) {
				if (this.checkLine(bd[r][c], bd[r][c + 1], bd[r][c + 2], bd[r][c + 3])) return bd[r][c];
			}
		}
		for (let r = 0; r < 3; r++) {
			for (let c = 0; c < 4; c++) {
				if (this.checkLine(bd[r][c], bd[r + 1][c + 1], bd[r + 2][c + 2], bd[r + 3][c + 3])) return bd[r][c];
			}
		}
		for (let r = 3; r < 6; r++) {
			for (let c = 0; c < 4; c++) {
				if (this.checkLine(bd[r][c], bd[r - 1][c + 1], bd[r - 2][c + 2], bd[r - 3][c + 3])) return bd[r][c];
			}
		}
		return null;
	}

	generateBoard() {
		const arr = [];
		for (let i = 0; i < 6; i++) {
			arr.push([null, null, null, null, null, null, null]);
		}
		return arr;
	}

	displayBoard(board, playerOneEmoji, playerTwoEmoji) {
		return board.map(row => row.map(piece => {
			if (piece === 'user') return playerOneEmoji;
			if (piece === 'oppo') return playerTwoEmoji;
			return blankEmoji;
		}).join('')).join('\n');
	}
};
