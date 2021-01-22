const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { verify } = require('../../util/Util');
const emoji = require('../../assets/json/nim');
const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

module.exports = class NimCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nim',
			group: 'games-mp',
			memberName: 'nim',
			description: 'Play a game of nim with another user.',
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to challenge?',
					type: 'user'
				},
				{
					key: 'rows',
					prompt: 'How many rows do you want to have?',
					type: 'integer',
					default: 5,
					min: 1,
					max: 10
				}
			]
		});
	}

	async run(msg, { opponent, rows }) {
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
		if (opponent.bot) return msg.reply('Bots may not be played against.');
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
			const board = this.generateBoard(rows);
			let userTurn = true;
			let winner = null;
			let lastTurnTimeout = false;
			let firstTurn = true;
			const objectEmoji = emoji[Math.floor(Math.random() * emoji.length)];
			while (!winner) {
				const user = userTurn ? msg.author : opponent;
				await msg.say(stripIndents`
					${user}, from which row do you want to remove from? Type \`end\` to forefeit.
					After this step, you will decide how many ${objectEmoji} to remove from that row.

					${this.displayBoard(board, objectEmoji)}

					${firstTurn ? '_In Nim, you win by forcing the opponent to take the last object._' : ''}
				`);
				const pickFilter = res => {
					if (res.author.id !== user.id) return false;
					const choice = res.content;
					if (choice.toLowerCase() === 'end') return true;
					const i = Number.parseInt(choice, 10) - 1;
					return board[i] && board[i] > 0;
				};
				const turn = await msg.channel.awaitMessages(pickFilter, {
					max: 1,
					time: 60000
				});
				if (!turn.size) {
					if (lastTurnTimeout) {
						await msg.say('Game ended due to inactivity.');
						winner = 'time';
						break;
					} else {
						await msg.say('Sorry, time is up!');
						lastTurnTimeout = true;
						continue;
					}
				}
				const choice = turn.first().content;
				const picked = Number.parseInt(choice, 10);
				if (choice.toLowerCase() === 'end') {
					winner = userTurn ? opponent : msg.author;
					break;
				}
				const row = board[picked - 1];
				await msg.say(stripIndents`
					How many ${objectEmoji} do you want to remove from row ${picked}? Type \`end\` to forefeit.
					If you want to go back, type \`back\`.

					${nums[picked - 1]}${objectEmoji.repeat(row)}
				`);
				const rowFilter = res => {
					if (res.author.id !== user.id) return false;
					const chosen = res.content;
					if (chosen.toLowerCase() === 'end' || chosen.toLowerCase() === 'back') return true;
					const i = Number.parseInt(chosen, 10) - 1;
					return row >= i && row > 0;
				};
				const rowTurn = await msg.channel.awaitMessages(rowFilter, {
					max: 1,
					time: 60000
				});
				if (!rowTurn.size) {
					if (lastTurnTimeout) {
						await msg.say('Game ended due to inactivity.');
						winner = 'time';
						break;
					} else {
						await msg.say('Sorry, time is up!');
						lastTurnTimeout = true;
						continue;
					}
				}
				const rowChoice = turn.first().content;
				const rowPicked = Number.parseInt(choice, 10);
				if (rowChoice.toLowerCase() === 'end') {
					winner = userTurn ? opponent : msg.author;
					break;
				}
				if (rowChoice.toLowerCase() === 'back') continue;
				board[picked - 1] -= rowPicked;
				if (!userTurn && firstTurn) firstTurn = false;
				if (!board.some(r => r !== 0)) {
					winner = userTurn ? opponent : msg.author;
					break;
				}
				userTurn = !userTurn;
			}
			this.client.games.delete(msg.channel.id);
			if (winner === 'time') return msg.say('Game ended due to inactivity.');
			return msg.say(`Congrats, ${winner}! You forced your opponent to pick the final object!`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}

	displayBoard(board, objectEmoji) {
		return board.map((amount, i) => `${nums[i]}${objectEmoji.repeat(amount)}`).join('\n');
	}

	generateBoard(rows) {
		const board = [];
		for (let i = 0; i < rows; i++) {
			board.push(i + 1);
		}
		return board;
	}
};
