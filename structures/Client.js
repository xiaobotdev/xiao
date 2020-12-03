const { CommandoClient } = require('discord.js-commando');
const { WebhookClient } = require('discord.js');
const Collection = require('@discordjs/collection');
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const Redis = require('./Redis');
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
		this.pokemon = new PokemonStore();
		this.memePoster = POSTER_ID && POSTER_TOKEN ? new MemePosterClient(POSTER_ID, POSTER_TOKEN, {
			subreddits,
			postTypes: ['image', 'rich:video'],
			postInterval: POSTER_TIME,
			disableMentions: 'everyone'
		}) : null;
		this.games = new Collection();
		this.phone = new Collection();
		this.activities = activities;
		this.leaveMessages = leaveMsgs;
	}

	inPhoneCall(channel) {
		return this.phone.some(call => call.origin.id === channel.id || call.recipient.id === channel.id);
	}

	isBlockedFromPhone(origin, recipient, caller) {
		return recipient.topic.includes(`<xiao:phone:block:${origin.id}>`)
			|| recipient.topic.includes(`<xiao:phone:block:${caller.id}>`)
			|| (origin.guild && recipient.topic.includes(`<xiao:phone:block:${origin.guild.id}>`))
			|| (origin.guild && origin.topic.includes(`<xiao:phone:block:${recipient.id}>`))
			|| (origin.guild && origin.topic.includes(`<xiao:phone:block:${recipient.guild.id}>`))
			|| (origin.guild && origin.topic.includes(`<xiao:phone:block:${caller.id}>`));
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

	fetchReportChannel() {
		if (!REPORT_CHANNEL_ID) return null;
		return this.channels.fetch(REPORT_CHANNEL_ID);
	}

	fetchJoinLeaveChannel() {
		if (!JOIN_LEAVE_CHANNEL_ID) return null;
		return this.channels.fetch(JOIN_LEAVE_CHANNEL_ID);
	}
};
