const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { verify } = require('../../util/Util');
const squareIDs = [5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23];

module.exports = class DotsAndBoxesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dots-and-boxes',
			aliases: ['dots-boxes', 'dot-box', 'dot-and-box', 'territory-capture'],
			group: 'games-mp',
			memberName: 'dots-and-boxes',
			description: 'Play a game of Dots and Boxes with another user.',
			guildOnly: true,
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to challenge?',
					type: 'user'
				}
			]
		});
	}

	async run(msg, { opponent }) {
		if (opponent.bot) return msg.reply('Bots may not be played against.');
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
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
			const board = this.generateBoard();
			const taken = [];
			const userOwned = [];
			const oppoOwned = [];
			let userTurn = true;
			let winner = null;
			let lastTurnTimeout = false;
			while (taken.length < 40) {
				const user = userTurn ? msg.author : opponent;
				await msg.say(stripIndents`
					${user}, which connection do you pick? Type \`end\` to forefeit.
					_Format like \`1-2\` or \`0-5\`. Any two spaces bordering **vertical or horizontal**._

					P1: ${msg.author.tag} | P2: ${opponent.tag}
					\`\`\`
					${this.displayBoard(board, taken, userOwned, oppoOwned)}
					\`\`\`
				`);
				const filter = res => {
					if (res.author.id !== user.id) return false;
					const choice = res.content;
					if (choice.toLowerCase() === 'end') return true;
					const matched = choice.match(/([0-9]+)-([0-9]+)/);
					if (!matched) return false;
					let first = Number.parseInt(matched[1], 10);
					let second = Number.parseInt(matched[2], 10);
					if (first === second) return false;
					if (second < first) {
						const temp = first;
						first = second;
						second = temp;
					}
					if (first > 24 || second > 24 || first < 0 || second < 0) return false;
					const column1 = first % 5;
					const column2 = second % 5;
					if (second !== first + 1 && column1 !== column2) {
						const row1 = Math.floor(first / 5);
						const row2 = Math.floor(second / 5);
						if (row2 !== row1 - 1) return false;
						return !taken.includes(`${first}-${second}`);
					}
					return !taken.includes(`${first}-${second}`);
				};
				const turn = await msg.channel.awaitMessages(filter, {
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
				const matched = choice.match(/([0-9]+)-([0-9]+)/);
				let first = Number.parseInt(matched[1], 10);
				let second = Number.parseInt(matched[2], 10);
				if (second < first) {
					const temp = first;
					first = second;
					second = temp;
				}
				taken.push(`${first}-${second}`);
				const newSquares = this.calcNewSquare(taken, userOwned, oppoOwned);
				if (newSquares.length) {
					for (const newSquare of newSquares) {
						if (userTurn) userOwned.push(newSquare);
						else oppoOwned.push(newSquare);
					}
					if (taken.length < 40) {
						await msg.say(`${user}, great job! Keep going until you can't make any more!`);
					}
				} else {
					userTurn = !userTurn;
				}
				if (lastTurnTimeout) lastTurnTimeout = false;
			}
			if (winner === 'time') return msg.say('Game ended due to inactivity.');
			winner = userOwned.length === oppoOwned.length
				? null
				: userOwned.length > oppoOwned.length ? msg.author : opponent;
			this.client.games.delete(msg.channel.id);
			return msg.say(winner ? `Congrats, ${winner}!` : 'Looks like it\'s a draw...');
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}

	calcSquare(num, taken) {
		return taken.includes(`${num}-${num + 1}`)
			&& taken.includes(`${num - 5}-${num}`)
			&& taken.includes(`${(num + 1) - 5}-${num + 1}`)
			&& taken.includes(`${num - 5}-${(num - 5) + 1}`);
	}

	calcNewSquare(taken, userOwned, oppoOwned) {
		const newSquares = [];
		for (const square of squareIDs) {
			if (userOwned.includes(square) || oppoOwned.includes(square)) continue;
			if (this.calcSquare(square, taken)) newSquares.push(square);
		}
		return newSquares;
	}

	generateBoard() {
		const arr = [];
		for (let i = 0; i < 5; i++) {
			const row = [];
			for (let j = 0 + (i * 5); j < 5 + (i * 5); j++) row.push(j);
			arr.push(row);
		}
		return arr;
	}

	displayBoard(board, taken, userOwned, oppoOwned) {
		const displayed = [];
		displayed.push(new Array(24).fill('█').join(''));
		displayed.push('█                      █');
		board.forEach((values, row) => {
			if (row !== 0) {
				let takenMids = '█  ';
				for (let i = 0 + (row * 5); i < 5 + (row * 5); i++) {
					if (taken.includes(`${i - 5}-${i}`)) takenMids += '||';
					else takenMids += '  ';
					takenMids += userOwned.includes(i) ? 'P1' : oppoOwned.includes(i) ? 'P2' : '  ';
				}
				takenMids += '█';
				displayed.push(takenMids);
			}
			displayed.push(`█  ${values.map(slot => {
				let val = slot.toString().padStart(2, '0');
				if (taken.includes(`${slot}-${slot + 1}`)) val += '==';
				else val += '  ';
				return val;
			}).join('')}█`);
		});
		displayed.push('█                      █');
		displayed.push(new Array(24).fill('█').join(''));
		return displayed.join('\n');
	}
};
