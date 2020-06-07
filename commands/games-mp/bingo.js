const Command = require('../../structures/Command');
const Collection = require('@discordjs/collection');
const { stripIndents } = require('common-tags');
const { randomRange } = require('../../util/Util');
const { SUCCESS_EMOJI_ID } = process.env;
const nums = require('../../assets/json/bingo');
const rows = Object.keys(nums);

module.exports = class BingoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bingo',
			group: 'games-mp',
			memberName: 'bingo',
			description: 'Play bingo with up to 99 other users.',
			guildOnly: true,
			args: [
				{
					key: 'playersCount',
					prompt: 'How many players are you expecting to have?',
					type: 'integer',
					min: 1,
					max: 100
				}
			]
		});
	}

	async run(msg, { playersCount }) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			const awaitedPlayers = await this.awaitPlayers(msg, playersCount);
			if (!awaitedPlayers) {
				this.client.games.delete(msg.channel.id);
				return msg.say('Game could not be started...');
			}
			const players = new Collection();
			for (const player of awaitedPlayers) {
				players.set(player, {
					board: this.generateBoard(),
					id: player,
					user: await this.client.users.fetch(player)
				});
			}
			let winner = null;
			const called = ['FR'];
			while (!winner) {
				const picked = randomRange(1, 75);
				called.push(picked);
				for (const player of players.values()) {
					try {
						await player.user.send(stripIndents`
							**${picked}** was called in ${msg.channel}.
							${this.generateBoardDisplay(player.board, called)}
						`);
					} catch {
						await msg.say(`${player.user}, I couldn't send your board! Turn on DMs!`);
					}
				}
				await msg.say(stripIndents`
					**${this.findRowValue(picked)}${picked}**!

					Check your DMs for your board. If you have bingo, type \`bingo\`!
					_Next number will be called in 10 seconds._
				`);
				const filter = res => {
					if (!players.has(res.author.id)) return false;
					if (res.content.toLowerCase() !== 'bingo') return false;
					if (!this.checkBingo(players.get(res.author.id).board, called)) {
						msg.say(`${res.author}, you don't have bingo, liar.`).catch(() => null);
						return false;
					}
					return true;
				};
				const bingo = await msg.channel.awaitMessages(filter, { max: 1, time: 10000 });
				if (!bingo.size) continue;
				winner = bingo.first().author;
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
		if (verify.size < 1) return false;
		return verify.map(player => player.author.id);
	}

	generateBoard() {
		const result = [];
		for (const [rowID, values] of Object.entries(nums)) {
			const picked = [];
			for (let i = 0; i < 5; i++) {
				const valid = values.filter(value => !picked.includes(value));
				picked.push(valid[Math.floor(Math.random() * valid.length)]);
			}
			const sorted = picked.sort((a, b) => a - b);
			if (rowID === 'N') sorted[2] = 'FR';
			result.push(sorted);
		}
		return result;
	}

	generateBoardDisplay(board, called) {
		const mapped = board.map((values, i) => {
			const row = rows[i];
			const mapVal = values.map(value => {
				if (called.includes(value) || value === 'FR') return 'XX';
				return value.toString().padStart(2, '0');
			}).join(' | ');
			return `${row} | ${mapVal}`;
		}).join('\n--------------------------\n');
		return stripIndents`
			\`\`\`
			${mapped}
			\`\`\`
		`;
	}

	findRowValue(num) {
		if (nums.B.includes(num)) return 'B';
		if (nums.I.includes(num)) return 'I';
		if (nums.N.includes(num)) return 'N';
		if (nums.G.includes(num)) return 'G';
		if (nums.O.includes(num)) return 'O';
		return null;
	}

	checkLine(called, a, b, c, d, e) {
		return called.includes(a)
			&& called.includes(b)
			&& called.includes(c)
			&& called.includes(d)
			&& called.includes(e);
	}

	checkBingo(bd, ca) {
		for (let r = 0; r < rows.length; r++) {
			if (this.checkLine(ca, bd[r][0], bd[r][1], bd[r][2], bd[r][3], bd[r][4])) return true;
		}
		for (let c = 0; c < rows.length; c++) {
			if (this.checkLine(ca, bd[0][c], bd[1][c], bd[2][c], bd[3][c], bd[4][c])) return true;
		}
		if (this.checkLine(ca, bd[0][0], bd[1][1], bd[2][2], bd[3][3], bd[4][4])) return true;
		if (this.checkLine(ca, bd[4][0], bd[3][1], bd[2][2], bd[1][3], bd[0][4])) return true;
		return false;
	}
};
