const { CommandoClient } = require('discord.js-commando');
const { WebhookClient } = require('discord.js');
const Collection = require('@discordjs/collection');
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const Redis = require('./Redis');
const PhoneManager = require('./phone/PhoneManager');
const TimerManager = require('./remind/TimerManager');
const PokemonStore = require('./pokemon/PokemonStore');
const MemePosterClient = require('./MemePoster');
const activities = require('../assets/json/activity');
const leaveMsgs = require('../assets/json/leave-messages');
const subreddits = require('../assets/json/meme');
const {
	XIAO_WEBHOOK_ID,
	XIAO_WEBHOOK_TOKEN,
	POSTER_ID,
	POSTER_TOKEN,
	POSTER_TIME,
	REPORT_CHANNEL_ID,
	JOIN_LEAVE_CHANNEL_ID
} = process.env;

module.exports = class XiaoClient extends CommandoClient {
	constructor(options) {
		super(options);

		this.logger = winston.createLogger({
			transports: [new winston.transports.Console()],
			format: winston.format.combine(
				winston.format.timestamp({ format: 'MM/DD/YYYY HH:mm:ss' }),
				winston.format.printf(log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`)
			)
		});
		this.redis = Redis ? Redis.db : null;
		this.webhook = new WebhookClient(XIAO_WEBHOOK_ID, XIAO_WEBHOOK_TOKEN, { disableMentions: 'everyone' });
		this.timers = new TimerManager(this);
		this.blacklist = { guild: [], user: [] };
		this.pokemon = new PokemonStore();
		this.memePoster = POSTER_ID && POSTER_TOKEN ? new MemePosterClient(POSTER_ID, POSTER_TOKEN, {
			subreddits,
			postTypes: ['image', 'rich:video'],
			postInterval: POSTER_TIME,
			disableMentions: 'everyone'
		}) : null;
		this.games = new Collection();
		this.dispatchers = new Map();
		this.phone = new PhoneManager(this);
		this.activities = activities;
		this.leaveMessages = leaveMsgs;
	}

	importBlacklist() {
		const read = fs.readFileSync(path.join(__dirname, '..', 'blacklist.json'), { encoding: 'utf8' });
		const file = JSON.parse(read);
		if (typeof file !== 'object' || Array.isArray(file)) return null;
		if (!file.guild || !file.user) return null;
		for (const id of file.guild) {
			if (typeof id !== 'string') continue;
			if (this.blacklist.guild.includes(id)) continue;
			this.blacklist.guild.push(id);
		}
		for (const id of file.user) {
			if (typeof id !== 'string') continue;
			if (this.blacklist.user.includes(id)) continue;
			this.blacklist.user.push(id);
		}
		return file;
	}

	exportBlacklist() {
		let text = '{\n	"guild": [\n		';
		if (this.blacklist.guild.length) {
			for (const id of this.blacklist.guild) {
				text += `"${id}",\n		`;
			}
			text = text.slice(0, -4);
		}
		text += '\n	],\n	"user": [\n		';
		if (this.blacklist.user.length) {
			for (const id of this.blacklist.user) {
				text += `"${id}",\n		`;
			}
			text = text.slice(0, -4);
		}
		text += '\n	]\n}\n';
		const buf = Buffer.from(text);
		fs.writeFileSync(path.join(__dirname, '..', 'blacklist.json'), buf, { encoding: 'utf8' });
		return buf;
	}

	importCommandLeaderboard() {
		const read = fs.readFileSync(path.join(__dirname, '..', 'command-leaderboard.json'), {
			encoding: 'utf8'
		});
		const file = JSON.parse(read);
		if (typeof file !== 'object' || Array.isArray(file)) return null;
		for (const [id, value] of Object.entries(file)) {
			if (typeof value !== 'number') continue;
			const found = this.registry.commands.get(id);
			if (!found || found.uses === undefined) continue;
			found.uses = value;
		}
		return file;
	}

	exportCommandLeaderboard() {
		let text = '{';
		for (const command of this.registry.commands.values()) {
			if (command.uses === undefined) continue;
			text += `\n	"${command.name}": ${command.uses},`;
		}
		text = text.slice(0, -1);
		text += '\n}\n';
		const buf = Buffer.from(text);
		fs.writeFileSync(path.join(__dirname, '..', 'command-leaderboard.json'), buf, {
			encoding: 'utf8'
		});
		return buf;
	}

	importLastRun() {
		const read = fs.readFileSync(path.join(__dirname, '..', 'command-last-run.json'), {
			encoding: 'utf8'
		});
		const file = JSON.parse(read);
		if (typeof file !== 'object' || Array.isArray(file)) return null;
		for (const [id, value] of Object.entries(file)) {
			if (!value) continue;
			const date = new Date(value);
			if (date.toString() === 'Invalid Date') continue;
			const found = this.registry.commands.get(id);
			if (!found || found.lastRun === undefined) continue;
			found.lastRun = date;
		}
		return file;
	}

	exportLastRun() {
		let text = '{';
		for (const command of this.registry.commands.values()) {
			if (command.lastRun === undefined) continue;
			text += `\n	"${command.name}": ${command.lastRun ? `"${command.lastRun.toISOString()}"` : null},`;
		}
		text = text.slice(0, -1);
		text += '\n}\n';
		const buf = Buffer.from(text);
		fs.writeFileSync(path.join(__dirname, '..', 'command-last-run.json'), buf, {
			encoding: 'utf8'
		});
		return buf;
	}

	fetchReportChannel() {
		if (!REPORT_CHANNEL_ID) return null;
		return this.channels.fetch(REPORT_CHANNEL_ID);
	}

	fetchJoinLeaveChannel() {
		if (!JOIN_LEAVE_CHANNEL_ID) return null;
		return this.channels.fetch(JOIN_LEAVE_CHANNEL_ID);
	}
};
