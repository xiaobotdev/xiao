const Collection = require('@discordjs/collection');
const path = require('path');
const { stripIndents } = require('common-tags');
const Player = require('./Player');
const { shuffle } = require('../../util/Util');
const { SUCCESS_EMOJI_ID } = process.env;

module.exports = class Game {
	constructor(client, channel, connection) {
		Object.defineProperty(this, 'client', { value: client });

		this.name = 'mafia';
		this.players = new Collection();
		this.channel = channel;
		this.connection = connection;
		this.turn = 1;
	}

	determineRoles(playerCount) {
		const roles = ['detective', 'mafia', 'mafia'];
		for (let i = 0; i < (playerCount - 3); i++) roles.push('innocent');
		return shuffle(roles);
	}

	async generate(list) {
		const roles = this.determineRoles(list.length);
		let i = 0;
		for (const user of list) {
			try {
				await user.send(`You are ${roles[i] === 'detective' ? 'the' : 'a part of the'} **${roles[i]}**.`);
			} catch (err) {
				await this.channel.send(
					`${user}, I couldn't send a DM to you. Please open your DMs and use the \`me\` command to see your role.`
				);
			}
			const player = new Player(this, user, roles[i]);
			this.players.set(user.id, player);
			i++;
		}
		return this.players;
	}

	playAudio(id) {
		this.dispatcher = this.connection.play(
			path.join(__dirname, '..', '..', 'assets', 'sounds', 'mafia', `${id}.mp3`), { volume: 2 }
		);
		return new Promise((res, rej) => {
			this.dispatcher.once('finish', () => {
				this.dispatcher = null;
				return res(true);
			});
			this.dispatcher.once('error', err => {
				this.dispatcher = null;
				return rej(err);
			});
		});
	}

	async getVotes(playersArr) {
		await this.channel.send(stripIndents`
			Who do you think is a Mafia member? Please type the number.
			${playersArr.map((p, i) => `**${i + 1}.** ${p.user.tag}`).join('\n')}
		`);
		const voted = [];
		const filter = res => {
			if (!this.players.some(p => p.user.id === res.author.id)) return false;
			if (voted.includes(res.author.id)) return false;
			if (!playersArr[Number.parseInt(res.content, 10) - 1]) return false;
			voted.push(res.author.id);
			res.react(SUCCESS_EMOJI_ID || '✅').catch(() => null);
			return true;
		};
		const votes = await this.channel.awaitMessages(filter, {
			max: this.players.size,
			time: 90000
		});
		if (!votes.size) return null;
		return votes;
	}

	getHanged(votes, playersArr) {
		const counts = new Collection();
		for (const vote of votes.values()) {
			const player = this.players.get(playersArr[Number.parseInt(vote.content, 10) - 1].id);
			if (counts.has(player.id)) {
				++counts.get(player.id).votes;
			} else {
				counts.set(player.id, {
					id: player.id,
					votes: 1,
					user: player.user
				});
			}
		}
		return counts.sort((a, b) => b.votes - a.votes).first();
	}

	get shouldEnd() {
		return this.players.size < 4 && !this.players.some(p => p.role === 'mafia');
	}

	get voiceChannel() {
		return this.connection.channel;
	}

	get dispatcher() {
		return this.client.dispatchers.get(this.channel.guild.id);
	}
};
