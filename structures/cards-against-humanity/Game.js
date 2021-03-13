const Collection = require('@discordjs/collection');
const Player = require('./Player');
const Deck = require('./Deck');
const { removeFromArray, awaitPlayers } = require('../../util/Util');
const { SUCCESS_EMOJI_ID, FAILURE_EMOJI_ID } = process.env;

module.exports = class Game {
	constructor(client, name, channel, whiteCards, blackCards, blackType) {
		Object.defineProperty(this, 'client', { value: client });

		this.name = name;
		this.channel = channel;
		this.players = new Collection();
		this.czars = [];
		this.whiteDeck = new Deck(whiteCards);
		this.blackDeck = new Deck(blackCards);
		this.joinLeaveCollector = null;
		this.winner = null;
		this.blackType = blackType;
	}

	addUser(user) {
		const player = new Player(this, user);
		player.dealHand();
		this.players.set(player.id, player);
		if (!user.bot) this.czars.push(player.id);
		return this.players;
	}

	get czar() {
		return this.players.get(this.czars[0]);
	}

	changeCzar() {
		this.czars.push(this.czars[0]);
		this.czars.shift();
		return this.czar;
	}

	kick(player) {
		this.players.delete(player.id);
		removeFromArray(this.czars, player.id);
	}

	async awaitPlayers(msg, bot) {
		const max = bot ? 9 : 10;
		const min = bot ? 2 : 3;
		const players = await awaitPlayers(msg, max, min, this.client.blacklist.user);
		if (!players) return false;
		for (const player of players.values()) {
			const user = await this.client.users.fetch(player);
			this.addUser(user);
		}
		if (bot) this.addUser(this.client.user);
		return true;
	}

	createJoinLeaveCollector() {
		const collector = this.channel.createMessageCollector(res => {
			if (res.author.bot) return false;
			if (this.players.has(res.author.id) && res.content.toLowerCase() !== 'leave game') return false;
			if (!this.players.has(res.author.id) && res.content.toLowerCase() !== 'join game') return false;
			if (this.czar.id === res.author.id || this.players.size >= 10) {
				res.react(FAILURE_EMOJI_ID || '❌').catch(() => null);
				return false;
			}
			if (!['join game', 'leave game'].includes(res.content.toLowerCase())) return false;
			res.react(SUCCESS_EMOJI_ID || '✅').catch(() => null);
			return true;
		});
		collector.on('collect', msg => {
			if (msg.content.toLowerCase() === 'join game') this.addUser(msg.author);
			else if (msg.content.toLowerCase() === 'leave game') this.kick(msg.author);
		});
		this.joinLeaveCollector = collector;
		return this.joinLeaveCollector;
	}

	stopJoinLeaveCollector() {
		if (!this.joinLeaveCollector) return null;
		return this.joinLeaveCollector.stop();
	}
};
