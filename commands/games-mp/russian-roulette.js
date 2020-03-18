const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { shuffle, verify } = require('../../util/Util');

module.exports = class RussianRouletteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'russian-roulette',
			aliases: ['r-roulette', 'russia-gun'],
			group: 'games-mp',
			memberName: 'russian-roulette',
			description: 'Who will pull the trigger and die first?',
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to gunfight?',
					type: 'user',
					default: () => this.client.user
				}
			]
		});
	}

	async run(msg, { opponent }) {
		if (opponent.id === msg.author.id) return msg.reply('You may not challenge yourself.');
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
			let userTurn = true;
			const gun = shuffle([true, false, false, false, false, false, false, false]);
			let round = 0;
			let winner = null;
			let quit = false;
			while (!winner) {
				const player = userTurn ? msg.author : opponent;
				const notPlayer = userTurn ? opponent : msg.author;
				if (gun[round]) {
					await msg.say(`**${player.tag}** pulls the trigger... **And dies!**`);
					winner = notPlayer;
				} else {
					await msg.say(stripIndents`
						**${player.tag}** pulls the trigger... **And lives...**
						${opponent.bot ? 'Continue?' : `Will you take the gun, ${notPlayer}?`} (${8 - round - 1} shots left)
					`);
					const keepGoing = await verify(msg.channel, opponent.bot ? msg.author : notPlayer);
					if (!keepGoing) {
						if (opponent.bot) winner = opponent;
						else winner = player;
						quit = true;
					}
					round++;
					userTurn = !userTurn;
				}
			}
			this.client.games.delete(msg.channel.id);
			if (quit) return msg.say(`${winner} wins, because their opponent was a coward.`);
			return msg.say(`The winner is ${winner}!`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}
};
