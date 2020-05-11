const Command = require('../../structures/Command');
const Collection = require('@discordjs/collection');
const { Hand } = require('pokersolver');
const { stripIndents } = require('common-tags');
const Deck = require('../../structures/cards/Deck');
const { formatNumber, list, delay } = require('../../util/Util');
const { SUCCESS_EMOJI_ID } = process.env;
const max = 4;
const min = 2;
const bigBlindAmount = 100;
const smallBlindAmount = 50;
const raiseRegex = /raise (\$?([0-9]+)?,?[0-9]+)/i;

module.exports = class PokerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'poker',
			aliases: ['texas-hold-em'],
			group: 'games-mp',
			memberName: 'poker',
			description: 'Play poker with up to 3 other users.',
			guildOnly: true,
			args: [
				{
					key: 'playersCount',
					prompt: 'How many players are you expecting to have?',
					type: 'integer',
					min,
					max
				}
			]
		});
	}

	async run(msg, { playersCount }) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, {
			name: this.name,
			data: {
				deck: new Deck(),
				players: new Collection(),
				turnData: {
					pot: 0,
					currentBet: 0,
					highestBetter: null
				}
			}
		});
		try {
			const awaitedPlayers = await this.awaitPlayers(msg, playersCount);
			if (!awaitedPlayers) {
				this.client.games.delete(msg.channel.id);
				return msg.say('Game could not be started...');
			}
			const players = this.client.games.get(msg.channel.id).data.players;
			for (const player of awaitedPlayers) {
				players.set(player, {
					money: 5000,
					id: player,
					hand: [],
					user: this.client.users.cache.get(player),
					currentBet: 0
				});
			}
			const { deck, turnData } = this.client.games.get(msg.channel.id).data;
			let winner = null;
			const rotation = players.map(p => p.id);
			while (!winner) {
				const bigBlind = players.get(rotation[1]);
				bigBlind.money -= bigBlindAmount;
				bigBlind.currentBet += bigBlindAmount;
				const smallBlind = players.get(rotation[2] || rotation[0]);
				smallBlind.money -= smallBlindAmount;
				smallBlind.currentBet += smallBlindAmount;
				rotation.push(rotation[0]);
				rotation.shift();
				await msg.say('Dealing player hands...');
				for (const player of players.values()) {
					player.hand.push(...deck.draw(2));
					try {
						await player.user.send(stripIndents`
							**Your Poker Hand:**
							${player.hand.map(c => c.textDisplay).join('\n')}

							**Money:** $${formatNumber(player.money)}
							${bigBlind.id === player.id ? '_You are the big blind._' : ''}
							${smallBlind.id === player.id ? '_You are the small blind._' : ''}
						`);
					} catch {
						await msg.say(`${player.user}, I couldn't send your hand! Turn on DMs!`);
					}
				}
				turnData.pot = bigBlindAmount + smallBlindAmount;
				turnData.currentBet = bigBlindAmount;
				turnData.highestBetter = bigBlind;
				let turnOver = false;
				const turnRotation = rotation.slice(0);
				if (players.size === 2) turnRotation.push(turnRotation[1], turnRotation[0]);
				else turnRotation.push(turnRotation[0], turnRotation[1]);
				turnRotation.shift();
				turnRotation.shift();
				while (!turnOver) turnOver = await this.bettingRound(msg, players, turnRotation, turnData);
				if (turnRotation.length === 1) {
					const remainer = players.get(turnRotation[0]);
					await msg.say(`${remainer.user} takes the pot.`);
					remainer.money += turnData.pot;
					await this.resetGame(msg, players);
					continue;
				}
				const dealerHand = deck.draw(3);
				await msg.say(stripIndents`
					**Dealer Hand:**
					${dealerHand.map(card => card.textDisplay).join('\n')}

					_Next betting round begins in 5 seconds._
				`);
				await delay(5000);
				turnOver = false;
				while (!turnOver) turnOver = await this.bettingRound(msg, players, turnRotation, turnData);
				if (turnRotation.length === 1) {
					const remainer = players.get(turnRotation[0]);
					await msg.say(`${remainer.user} takes the pot.`);
					remainer.money += turnData.pot;
					await this.resetGame(msg, players);
					continue;
				}
				dealerHand.push(deck.draw());
				await msg.say(stripIndents`
					**Dealer Hand:**
					${dealerHand.map(card => card.textDisplay).join('\n')}

					_Next betting round begins in 5 seconds._
				`);
				await delay(5000);
				turnOver = false;
				while (!turnOver) turnOver = await this.bettingRound(msg, players, turnRotation, turnData);
				if (turnRotation.length === 1) {
					const remainer = players.get(turnRotation[0]);
					await msg.say(`${remainer.user} takes the pot.`);
					remainer.money += turnData.pot;
					await this.resetGame(msg, players);
					continue;
				}
				dealerHand.push(deck.draw());
				await msg.say(stripIndents`
					**Dealer Hand:**
					${dealerHand.map(card => card.textDisplay).join('\n')}

					_Next betting round begins in 5 seconds._
				`);
				await delay(5000);
				turnOver = false;
				while (!turnOver) turnOver = await this.bettingRound(msg, players, turnRotation, turnData);
				if (turnRotation.length === 1) {
					const remainer = players.get(turnRotation[0]);
					await msg.say(`${remainer.user} takes the pot.`);
					remainer.money += turnData.pot;
					await this.resetGame(msg, players);
					continue;
				}
				const solved = [];
				for (const playerID of turnRotation) {
					const player = players.get(playerID);
					const solvedHand = Hand.solve([
						...player.hand.map(card => card.pokersolverKey),
						...dealerHand.map(card => card.pokersolverKey)
					]);
					solvedHand.user = player;
					solved.push(solvedHand);
				}
				const winners = Hand.winners(solved);
				if (winners.length > 1) {
					await msg.say(stripIndents`
						The pot will be split between ${list(winners.map(w => `**${w.user.user}**`))}.
						${winners.map(winner.desc).join(', ')}
					`);
					const splitPot = turnData.pot / winners.length;
					for (const win of winners) win.user.money += splitPot;
				} else {
					await msg.say(`${winners[0].user.user} takes the pot, with **${winners[0].desc}**.`);
					winners[0].user.money += turnData.pot;
				}
				await this.resetGame(msg, players);
				if (players.size === 1) winner = players.first();
			}
			this.client.games.delete(msg.channel.id);
			return msg.say(`Congrats, ${winner.user}!`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}

	async awaitPlayers(msg, players) {
		await msg.say(`You will need at least 1 more player (at max ${players - 1}). To join, type \`join game\`.`);
		const joined = [];
		joined.push(msg.author.id);
		const filter = res => {
			if (res.author.bot) return false;
			if (joined.includes(res.author.id)) return false;
			if (res.content.toLowerCase() !== 'join game') return false;
			joined.push(res.author.id);
			res.react(SUCCESS_EMOJI_ID || '✅').catch(() => null);
			return true;
		};
		const verify = await msg.channel.awaitMessages(filter, { max: players - 1, time: 30000 });
		verify.set(msg.id, msg);
		if (verify.size < min) return false;
		return verify.map(player => player.author.id);
	}

	determineActions(turnPlayer, currentBet) {
		const actions = [];
		if (turnPlayer.currentBet !== currentBet) actions.push('fold');
		if (turnPlayer.money > currentBet) actions.push('raise <amount>');
		if (turnPlayer.money >= currentBet && turnPlayer.currentBet !== currentBet) actions.push('call');
		if (currentBet === turnPlayer.currentBet) actions.push('check');
		return actions;
	}

	async bettingRound(msg, players, turnRotation, data) {
		const turnPlayer = players.get(turnRotation[0]);
		const actions = this.determineActions(turnPlayer, data.currentBet);
		const displayActions = list(actions.map(action => `\`${action}\``), 'or');
		await msg.say(stripIndents`
			**Pot: $${formatNumber(data.pot)}**
			_Highest Bet: $${formatNumber(data.currentBet)} (${data.highestBetter.user.tag})_

			${turnPlayer.user}, what do you want to do? You can ${displayActions}.
		`);
		const filter = res => {
			if (res.author.id !== turnPlayer.id) return false;
			let choice = res.content.toLowerCase();
			if (actions.includes(choice) && !choice.startsWith('raise')) return true;
			if (choice.startsWith('raise')) {
				if (!raiseRegex.test(choice)) return false;
				choice = choice.replace(/[$,]/g, '');
				const amount = Number.parseInt(choice.match(raiseRegex)[1], 10);
				if (amount + data.currentBet > turnPlayer.money || amount < 1) return false;
				return true;
			}
			return false;
		};
		const msgs = await msg.channel.awaitMessages(filter, { max: 1, time: 60000 });
		let choiceAction;
		if (!msgs.size) {
			if (turnPlayer.currentBet !== data.currentBet) choiceAction = 'fold';
			else if (data.currentBet === turnPlayer.currentBet) choiceAction = 'check';
			else choiceAction = 'fold';
		} else {
			choiceAction = msgs.first().content.toLowerCase().replace(/[$,]/g, '');
		}
		const raiseValue = raiseRegex.test(choiceAction) ? Number.parseInt(choiceAction.match(raiseRegex)[1], 10) : null;
		if (raiseValue) {
			data.currentBet += raiseValue;
			data.pot += raiseValue + (data.currentBet - turnPlayer.currentBet);
			data.highestBetter = turnPlayer;
			turnPlayer.money -= raiseValue + (data.currentBet - turnPlayer.currentBet);
			turnPlayer.currentBet += raiseValue + (data.currentBet - turnPlayer.currentBet);
			await msg.say(`${turnPlayer.user} **raises $${formatNumber(raiseValue)}**.`);
		} else if (choiceAction === 'call') {
			turnPlayer.money -= (data.currentBet - turnPlayer.currentBet);
			turnPlayer.currentBet += (data.currentBet - turnPlayer.currentBet);
			data.pot += (data.currentBet - turnPlayer.currentBet);
			await msg.say(`${turnPlayer.user} **calls $${formatNumber(data.currentBet)}**.`);
		} else if (choiceAction === 'fold') {
			await msg.say(`${turnPlayer.user} **folds**.`);
		} else if (choiceAction === 'check') {
			await msg.say(`${turnPlayer.user} **checks**.`);
		}
		if (choiceAction !== 'fold') turnRotation.push(turnRotation[0]);
		turnRotation.shift();
		return (data.highestBetter.id === turnPlayer.id && choiceAction === 'check')
			|| (data.highestBetter.currentBet === turnPlayer.currentBet && turnRotation[0] === data.highestBetter.id)
			|| turnRotation.length === 1;
	}

	async resetGame(msg, players) {
		for (const player of players.values()) {
			if (player.money <= 0) {
				await msg.say(`${player.user} has been kicked.`);
				players.delete(player.id);
			} else {
				player.currentBet = 0;
				player.hand = [];
			}
		}
		return players;
	}
};
