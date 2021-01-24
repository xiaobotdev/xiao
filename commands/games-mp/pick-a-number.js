const Command = require('../../structures/Command');
const { verify } = require('../../util/Util');
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

module.exports = class PickANumberCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pick-a-number',
			aliases: ['pick-number', 'pick-a-number-between', 'pick-a-num', 'pick-num'],
			group: 'games-mp',
			memberName: 'pick-a-number',
			description: 'Two players pick a number between 1 and 10. Whoever\'s closer wins.',
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to play against? To play against AI, choose me.',
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
			const clientOpp = opponent.id === this.client.user.id;
			if (!opponent.bot) {
				await msg.say(`${opponent}, do you accept this challenge?`);
				const verification = await verify(msg.channel, opponent);
				if (!verification) {
					this.client.games.delete(msg.channel.id);
					return msg.say('Looks like they declined...');
				}
			}
			await msg.say(`${msg.author}, pick a number from 1 to 10.`);
			let userTurn = true;
			let player1Pick = null;
			const filter = res => {
				if (res.author.id !== (userTurn ? msg.author.id : opponent.id)) return false;
				const num = Number.parseInt(res.content, 10);
				if (!userTurn && num === player1Pick) return false;
				return num && nums.includes(num);
			};
			const player1 = await msg.channel.awaitMessages(filter, {
				max: 1,
				time: 30000
			});
			if (!player1.size) {
				this.client.games.delete(msg.channel.id);
				return msg.say('I guess you didn\'t want to play after all...');
			}
			player1Pick = Number.parseInt(player1.first().content, 10);
			let player2Pick;
			if (opponent.bot) {
				const valid = nums.filter(num => num !== player1Pick);
				player2Pick = valid[Math.floor(Math.random() * valid.length)];
				await msg.say(`Okay, ${clientOpp ? 'I' : `${opponent}`} pick${clientOpp ? '' : 's'} ${player2Pick}!`);
			} else {
				userTurn = false;
				await msg.say(`${opponent}, pick a number from 1 to 10, except ${player1Pick}.`);
				const player2 = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 30000
				});
				if (!player2.size) {
					this.client.games.delete(msg.channel.id);
					return msg.say('I guess you didn\'t want to play after all...');
				}
				player2Pick = Number.parseInt(player2.first().content, 10);
			}
			const num = Math.floor(Math.random() * 10) + 1;
			const winNum = [player1Pick, player2Pick].sort((a, b) => Math.abs(num - a) - Math.abs(num - b))[0];
			const winner = winNum === player1Pick ? msg.author : opponent;
			const clientWin = clientOpp && this.client.user.id === winner.id;
			this.client.games.delete(msg.channel.id);
			return msg.say(`The number was **${num}**! ${clientWin ? 'I' : winner} win${clientWin ? '' : 's'}!`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}
};
