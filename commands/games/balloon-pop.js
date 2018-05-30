const Command = require('../../structures/Command');
const { randomRange, verify } = require('../../util/Util');

module.exports = class BalloonPopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'balloon-pop',
			group: 'games',
			memberName: 'balloon-pop',
			description: 'Don\'t let yourself be the last one to pump the balloon before it pops!',
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to play against?',
					type: 'user',
					default: () => this.client.user
				}
			]
		});

		this.playing = new Set();
	}

	async run(msg, { opponent }) {
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
		if (this.playing.has(msg.channel.id)) return msg.reply('Only one game may be occurring per channel.');
		this.playing.add(msg.channel.id);
		try {
			if (!opponent.bot) {
				await msg.say(`${opponent}, do you accept this challenge?`);
				const verification = await verify(msg.channel, opponent);
				if (!verification) {
					this.playing.delete(msg.channel.id);
					return msg.say('Looks like they declined...');
				}
			}
			let userTurn = false;
			let winner = null;
			let remains = 500;
			let turns = 0;
			while (!winner) {
				const user = userTurn ? msg.author : opponent;
				let pump;
				++turns;
				if (!opponent.bot || (opponent.bot && userTurn)) {
					await msg.say(`${user}, do you pump the balloon?`);
					pump = await verify(msg.channel, user);
				} else {
					pump = Boolean(Math.floor(Math.random() * 2));
				}
				if (pump) {
					await msg.say(`${user} pumps the balloon!`);
					remains -= randomRange(25, 75);
					const popped = Math.floor(Math.random() * remains);
					if (popped <= 0) {
						await msg.say('The balloon pops!');
						winner = userTurn ? opponent : msg.author;
						break;
					}
					if (turns >= 3) {
						turns = 0;
						userTurn = !userTurn;
					}
				} else {
					await msg.say(`${user} steps back!`);
					turns = 0;
					userTurn = !userTurn;
				}
			}
			this.playing.delete(msg.channel.id);
			return msg.say(`And the winner is... ${winner}! Great job!`);
		} catch (err) {
			this.playing.delete(msg.channel.id);
			throw err;
		}
	}
};
