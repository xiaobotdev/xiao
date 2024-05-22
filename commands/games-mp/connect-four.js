const Command = require('../../framework/Command');
const { Connect4AI } = require('connect4-ai');
const { stripIndents } = require('common-tags');
const emojiRegex = require('emoji-regex');
const { verify, list } = require('../../util/Util');
const { LOADING_EMOJI_ID } = process.env;
const blankEmoji = '⚪';
const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'];
const colors = require('../../assets/json/connect-four');
colors.loading = `<a:loading:${LOADING_EMOJI_ID}>`;
const customEmojiRegex = /^(?:<a?:([a-zA-Z0-9_]+):)?([0-9]+)>?$/;

module.exports = class ConnectFourCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'connect-four',
			aliases: ['connect-4', 'c4'],
			group: 'games-mp',
			description: 'Play a game of Connect Four with another user or the AI.',
			game: true,
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
					type: 'user'
				},
				{
					key: 'color',
					type: 'custom-emoji|default-emoji|string',
					validate: (color, msg) => {
						const hasEmoji = new RegExp(`^(?:${emojiRegex().toString()})$`).test(color);
						const hasCustom = color.match(customEmojiRegex);
						if (hasCustom && !msg.guild) return 'You can only use custom emoji in a server.';
						if (hasCustom && msg.guild && !msg.guild.emojis.cache.has(hasCustom[2])) {
							return 'You can only use custom emoji from this server.';
						}
						if (!hasCustom && !hasEmoji && !colors[color.toLowerCase()]) {
							return `Please enter an emoji or one of the following: ${list(Object.keys(colors), 'or')}.`;
						}
						if (color === blankEmoji) return 'You cannot use this emoji.';
						return true;
					},
					parse: (color, msg) => {
						const hasCustom = color.match(customEmojiRegex);
						if (hasCustom && msg.guild) return msg.guild.emojis.cache.get(hasCustom[2]).toString();
						return colors[color.toLowerCase()] || color;
					}
				}
			]
		});
	}

	async run(msg, { opponent, color }) {
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
		if (this.client.blacklist.user.includes(opponent.id)) return msg.reply('This user is blacklisted.');
		const playerOneEmoji = color;
		let playerTwoEmoji = color === colors.yellow ? colors.red : colors.yellow;
		const available = Object.keys(colors).filter(clr => color !== colors[clr]);
		if (opponent.bot) {
			playerTwoEmoji = colors[available[Math.floor(Math.random() * available.length)]];
		} else {
			await msg.say(`${opponent}, do you accept this challenge?`);
			const verification = await verify(msg.channel, opponent);
			if (!verification) return msg.say('Looks like they declined...');
			await msg.say(
				`${opponent}, what color do you want to be? Either an emoji or one of ${list(available, 'or')}.`
			);
			const filter = res => {
				if (res.author.id !== opponent.id) return false;
				if (res.content === blankEmoji) return false;
				const hasEmoji = new RegExp(`^(?:${emojiRegex().source})$`).test(res.content);
				const hasCustom = res.content.match(customEmojiRegex);
				if (hasCustom && msg.guild && !msg.guild.emojis.cache.has(hasCustom[2])) return false;
				return (hasCustom && msg.guild) || hasEmoji || available.includes(res.content.toLowerCase());
			};
			const p2Color = await msg.channel.awaitMessages({
				filter,
				max: 1,
				time: 30000
			});
			if (p2Color.size) {
				const choice = p2Color.first().content.toLowerCase();
				const hasCustom = choice.match(customEmojiRegex);
				if (hasCustom && msg.guild) {
					playerTwoEmoji = msg.guild.emojis.cache.get(hasCustom[2]).toString();
				} else {
					playerTwoEmoji = colors[choice] || choice;
				}
			}
		}
		const AIEngine = new Connect4AI();
		const board = this.generateBoard();
		let userTurn = true;
		let winner = null;
		const colLevels = [5, 5, 5, 5, 5, 5, 5];
		let lastMove = 'None';
		while (!winner && board.some(row => row.includes(null))) {
			const user = userTurn ? msg.author : opponent;
			const sign = userTurn ? 'user' : 'oppo';
			let i;
			if (opponent.bot && !userTurn) {
				i = AIEngine.playAI('hard');
				lastMove = i + 1;
			} else {
				const emoji = userTurn ? playerOneEmoji : playerTwoEmoji;
				await msg.say(stripIndents`
					${emoji} ${user}, which column do you pick? Type \`end\` to forfeit.
					Can't think of a move? Use \`play for me\`.
					${opponent.bot ? `I placed mine in **${lastMove}**.` : `Previous Move: **${lastMove}**`}

					${this.displayBoard(board, playerOneEmoji, playerTwoEmoji)}
					${nums.join('')}
				`);
				const pickFilter = res => {
					if (res.author.id !== user.id) return false;
					const choice = res.content;
					if (choice.toLowerCase() === 'end') return true;
					if (choice.toLowerCase() === 'play for me') return true;
					const j = Number.parseInt(choice, 10) - 1;
					return board[colLevels[j]] && board[colLevels[j]][j] !== undefined;
				};
				const turn = await msg.channel.awaitMessages({
					filter: pickFilter,
					max: 1,
					time: 60000
				});
				const choice = turn.size ? turn.first().content : null;
				if (!choice) {
					await msg.say('Sorry, time is up! I\'ll pick their move for them.');
					i = AIEngine.playAI('hard');
					lastMove = i + 1;
				} else if (choice.toLowerCase() === 'end') {
					winner = userTurn ? opponent : msg.author;
					break;
				} else if (choice.toLowerCase() === 'play for me') {
					i = AIEngine.playAI('hard');
					lastMove = i + 1;
				} else {
					i = Number.parseInt(choice, 10) - 1;
					AIEngine.play(i);
					lastMove = i + 1;
				}
			}
			board[colLevels[i]][i] = sign;
			colLevels[i]--;
			if (this.verifyWin(board)) winner = userTurn ? msg.author : opponent;
			userTurn = !userTurn;
		}
		if (winner === 'time') return msg.say('Game ended due to inactivity.');
		return msg.say(stripIndents`
				${winner ? `Congrats, ${winner}!` : 'Looks like it\'s a draw...'}
				Final Move: **${lastMove}**

				${this.displayBoard(board, playerOneEmoji, playerTwoEmoji)}
				${nums.join('')}
			`);
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
