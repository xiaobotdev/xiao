const Command = require('../../framework/Command');
const { Collection } = require('@discordjs/collection');
const { stripIndents } = require('common-tags');
const { shuffle, verify, awaitPlayers, removeFromArray } = require('../../util/Util');

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
					key: 'playersCount',
					type: 'integer',
					min: 1,
					max: 7
				}
			]
		});
	}

	async run(msg, { playersCount }) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			const awaitedPlayers = await awaitPlayers(msg, playersCount, 1, this.client.blacklist.user);
			if (!awaitedPlayers) {
				this.client.games.delete(msg.channel.id);
				return msg.say('Game could not be started...');
			}
			const players = new Collection();
			for (const player of awaitedPlayers) {
				players.set(player, {
					id: player,
					user: await this.client.users.fetch(player)
				});
			}
			players.set(this.client.user.id, {
				id: this.client.user.id,
				user: this.client.user
			});
			const turn = shuffle(players.map(player => player.id));
			const gun = shuffle([true, false, false, false, false, false, false, false]);
			let round = 0;
			let loser = null;
			let winner = null;
			const wallOfShame = [];
			while (!loser && !winner) {
				const player = players.get(turn[0]);
				turn.push(turn[0]);
				turn.shift();
				if (gun[round]) {
					await msg.say(`**${player.user.tag}** pulls the trigger... **And dies!**`);
					loser = player;
				} else {
					const nextUp = players.get(turn[0]).user;
					await msg.say(stripIndents`
						**${player.user.tag}** pulls the trigger... **And lives...**
						${nextUp.bot ? '' : `Will you take the gun, ${nextUp}?`}
					`);
					if (!nextUp.bot) {
						let first = true;
						/* eslint-disable max-depth */
						for (const next of turn) {
							const nextPlayer = players.get(next);
							if (!first) {
								await msg.say(stripIndents`
									Coward.
									${nextPlayer.user}, will YOU take the gun?
								`);
							}
							if (first) first = false;
							const keepGoing = await verify(msg.channel, nextPlayer.user);
							if (keepGoing) break;
							wallOfShame.push(players.get(next).user.toString());
							players.delete(next);
							removeFromArray(turn, next);
						}
						/* eslint-enable max-depth */
					}
					if (players.size === 1) winner = players.first();
					round++;
				}
			}
			this.client.games.delete(msg.channel.id);
			if (winner) {
				return msg.say(stripIndents`
					The winner is ${winner.user}!

					__**Wall Of Shame:**__
					${wallOfShame.length ? wallOfShame.join('\n') : 'No one!'}
				`);
			}
			return msg.say(stripIndents`
				The loser is ${loser.user}!

				__**Wall Of Shame:**__
				${wallOfShame.length ? wallOfShame.join('\n') : 'No one!'}
			`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}
};
