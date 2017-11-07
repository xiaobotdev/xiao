const { Command } = require('discord.js-commando');
const { escapeMarkdown } = require('discord.js');
const { stripIndents } = require('common-tags');
const { shuffle, awaitPlayers } = require('../../util/Util');
const { greenCards, redCards } = require('../../assets/json/apples-to-apples');

module.exports = class ApplesToApplesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'apples-to-apples',
			group: 'games',
			memberName: 'apples-to-apples',
			description: 'Play a game of Apples to Apples.',
			guildOnly: true,
			args: [
				{
					key: 'maxPts',
					label: 'maximum amount of points',
					prompt: 'What amount of points should determine the winner?',
					type: 'integer',
					min: 1,
					max: 20
				}
			]
		});

		this.playing = new Set();
	}

	async run(msg, { maxPts }) {
		if (this.playing.has(msg.channel.id)) return msg.reply('Only one game may be occurring per channel.');
		this.playing.add(msg.channel.id);
		try {
			await msg.say('You will need at least 2 more players, at maximum 20. To join, type `join game`.');
			const awaitedPlayers = await awaitPlayers(msg, 20, 3);
			if (!awaitedPlayers) {
				this.playing.delete(msg.channel.id);
				return msg.say('Game could not be started...');
			}
			const players = await this.generatePlayers(awaitedPlayers);
			let czars = Array.from(players.values());
			let winner = null;
			while (!winner) {
				const czar = czars[0];
				czars.push(czar);
				czars.shift();
				const green = greenCards[Math.floor(Math.random() * greenCards.length)];
				await msg.say(stripIndents`
					The card czar will be ${czar.user}!
					The Green Card is: **${escapeMarkdown(green)}**

					Sending DMs...
				`);
				const chosenCards = [];
				for (const player of players.values()) {
					if (player.hand.size < 11) {
						const valid = redCards.filter(card => !player.hand.has(card));
						player.hand.add(valid[Math.floor(Math.random() * valid.length)]);
					}
					if (player.user.id === czar.user.id) continue;
					if (!player.hand.size) {
						await player.user.send('You don\'t have enough cards!');
						continue;
					}
					const hand = Array.from(player.hand);
					await player.user.send(stripIndents`
						__**Your hand is**__:
						${hand.map((card, i) => `**${i + 1}.** ${card}`).join('\n')}

						**Green Card**: ${escapeMarkdown(green)}
						**Card Czar**: ${czar.user.username}
						Pick **1** card!
					`);
					let chosen = null;
					const filter = res => {
						const existing = hand[parseInt(res.content, 10) - 1];
						if (!existing) return false;
						chosen = existing;
						return true;
					};
					const choice = await player.user.dmChannel.awaitMessages(filter, {
						max: 1,
						time: 120000
					});
					if (!choice.size) {
						await player.user.send('Skipping your turn...');
						continue;
					}
					player.hand.delete(chosen);
					chosenCards.push({
						id: player.id,
						card: chosen
					});
					await player.user.send(`Nice! Return to ${msg.channel} to await the results!`);
				}
				if (!chosenCards.length) {
					await msg.say('Hmm... No one even tried.');
					break;
				}
				const cards = shuffle(chosenCards);
				await msg.say(stripIndents`
					${czar.user}, which card do you pick?
					**Green Card**: ${escapeMarkdown(green)}

					${cards.map((card, i) => `**${i + 1}.** ${card.card}`).join('\n')}
				`);
				const filter = res => {
					if (res.author.id !== czar.user.id) return false;
					if (!cards[parseInt(res.content, 10) - 1]) return false;
					return true;
				};
				const chosen = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 120000
				});
				if (!chosen.size) {
					await msg.say('Hmm... No one wins.');
					continue;
				}
				const player = players.get(cards[parseInt(chosen.first().content, 10) - 1].id);
				++player.points;
				if (player.points >= maxPts) winner = player.user;
				else await msg.say(`Nice one, ${player.user}! You now have **${player.points}** points!`);
			}
			this.playing.delete(msg.channel.id);
			if (!winner) return msg.say('See you next time!');
			return msg.say(`And the winner is... ${winner}! Great job!`);
		} catch (err) {
			this.playing.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async generatePlayers(list) {
		const players = new Map();
		for (const user of list) {
			const cards = new Set();
			for (let i = 0; i < 5; i++) {
				const valid = redCards.filter(card => !cards.has(card));
				cards.add(valid[Math.floor(Math.random() * valid.length)]);
			}
			players.set(user.id, {
				id: user.id,
				user,
				points: 0,
				hand: cards
			});
			await user.send('Hi! Waiting for your turn to start...');
		}
		return players;
	}
};
