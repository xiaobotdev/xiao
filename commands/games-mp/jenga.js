const Command = require('../../structures/Command');
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
					prompt: 'What user would you like to challenge?',
					type: 'user',
					default: () => this.client.user
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
			const board = [true, true, true, true, true, true, true, true, true, true];
			let userTurn = true;
			let winner = null;
			let lastTurnTimeout = false;
			while (!winner && board.length) {
				const user = userTurn ? msg.author : opponent;
				let i;
				if (opponent.bot && !userTurn) {
					i = Math.floor(Math.random() * board.length);
				} else {
					const text = stripIndents`
						${user}, which block do you want to remove? Type \`end\` to forefeit.
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
					i = picked - 1;
				}
				const fell = Math.floor(Math.random() * ((board.length + 1) - i));
				if (!fell) {
					winner = userTurn ? opponent : msg.author;
					await msg.say(`${opponent.bot && !userTurn ? `I pick ${i + 1}, a` : 'A'}nd the tower topples!`);
					break;
				}
				await msg.say(`${opponent.bot && !userTurn ? `I pick ${i + 1}. ` : ''}Thankfully, the tower stands.`);
				board.shift();
				userTurn = !userTurn;
			}
			this.client.games.delete(msg.channel.id);
			if (winner === 'time') return msg.say('Game ended due to inactivity.');
			return msg.say(winner ? `Congrats, ${winner}!` : 'Looks like it\'s a draw...');
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}

	displayBoard(board) {
		return board.map((b, i) => `${i % 2 ? '          ' : nums[i]}🟫🟫🟫🟫🟫${i % 2 ? nums[i] : ''}`).join('\n');
	}
};
