const { Command } = require('discord.js-commando');
const { Collection, escapeMarkdown } = require('discord.js');
const { stripIndents } = require('common-tags');
const { awaitPlayers } = require('../../util/Util');
const { blackCards, whiteCards } = require('../../assets/json/cards-against-humanity');

module.exports = class CardsAgainstHumanityCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cards-against-humanity',
			aliases: ['crude-cards', 'pretend-youre-xyzzy'],
			group: 'games',
			memberName: 'cards-against-humanity',
			description: 'Play a game of Cards Against Humanity.',
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
			const players = new Map();
			let i = 1;
			for (const player of awaitedPlayers) {
				const cards = new Set();
				for (let j = 0; j < 5; j++) cards.add(whiteCards[Math.floor(Math.random() * whiteCards.length)]);
				players.set(i, {
					id: i,
					user: player,
					points: 0,
					hand: cards
				});
				await player.send('Hi! Waiting for your turn to start...');
				i++;
			}
			let czars = Array.from(players.values());
			let winner = null;
			while (!winner) {
				const czar = czars[0];
				czars.push(czar);
				czars.shift();
				const black = blackCards[Math.floor(Math.random() * blackCards.length)];
				await msg.say(stripIndents`
					The card czar will be ${czar.user.username}!
					The Black Card is: ${escapeMarkdown(black.text)}
					Sending DMs...
				`);
				const chosenCards = new Collection();
				for (const player of players.values()) {
					if (player.user.id === czar.user.id) continue;
					player.hand.add(whiteCards[Math.floor(Math.random() * whiteCards.length)]);
					if (player.hand.size < black.pick) {
						await player.user.send('You don\'t have enough cards!');
						continue;
					}
					await player.user.send(stripIndents`
						Your hand is:
						${Array.from(player.hand).join('\n')}

						The Black Card is; ${escapeMarkdown(black.text)}
						The card czar is: ${czar.user.username}
						Pick ${black.pick} cards!
					`);
					const chosen = [];
					const filter = res => {
						if (chosen.includes(res.content)) return false;
						if (!player.hand.has(res.content)) return false;
						player.hand.delete(res.content);
						chosen.push(res.content);
						return true;
					};
					const choices = await player.user.dmChannel.awaitMessages(filter, {
						max: black.pick,
						time: 30000
					});
					if (!choices.size || choices.size < black.pick) {
						await player.user.send('Skipping your turn...');
						continue;
					}
					chosenCards.set(player.id, {
						id: player.id,
						cards: chosen
					});
					await msg.say(`Nice! Return to ${msg.channel} to await the results!`);
				}
				if (!chosenCards.size) {
					await msg.say('Hmm... No one even tried.');
					break;
				}
				await msg.say(stripIndents`
					${czar.user}, which cards do you pick?
					Black Card: ${escapeMarkdown(black.text)}

					${chosenCards.map(card => `**${card.id}.** ${card.cards.join(', ')}`)}
				`);
				const filter = res => {
					if (res.author.id !== czar.user.id) return false;
					if (!chosenCards.map(card => card.id).includes(parseInt(res.content, 10))) return false;
					return true;
				};
				const chosen = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 30000
				});
				if (!chosen.size) {
					await msg.say('Hmm... No one wins.');
					continue;
				}
				const player = players.get(parseInt(chosen.first().content, 10));
				++player.points;
				if (player.points >= maxPts) winner = player.user;
				else await msg.say(`Nice one, ${player.user}! You now have ${player.user} points!`);
			}
			this.playing.delete(msg.channel.id);
			if (!winner) return msg.say('See you next time!');
			return msg.say(`And the winner is... ${winner}! Great job!`);
		} catch (err) {
			this.playing.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
