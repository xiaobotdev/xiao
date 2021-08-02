const CommandClient = require('../framework/Client');
const { WebhookClient } = require('discord.js');
const request = require('node-superfetch');
const { Collection } = require('@discordjs/collection');
const winston = require('winston');
const fontFinder = require('font-finder');
const nsfw = require('nsfwjs');
const moment = require('moment-timezone');
const fs = require('fs');
const url = require('url');
const path = require('path');
const Redis = require('./Redis');
const Font = require('./Font');
const BotList = require('./BotList');
const PhoneManager = require('./phone/PhoneManager');
const TimerManager = require('./remind/TimerManager');
const PokemonStore = require('./pokemon/PokemonStore');
const activities = require('../assets/json/activity');
const leaveMsgs = require('../assets/json/leave-messages');
const {
	XIAO_WEBHOOK_ID,
	XIAO_WEBHOOK_TOKEN,
	REPORT_CHANNEL_ID,
	JOIN_LEAVE_CHANNEL_ID,
	COMMAND_CHANNEL_ID
} = process.env;

module.exports = class XiaoClient extends CommandClient {
	constructor(options) {
		super(options);

		this.logger = winston.createLogger({
			transports: [new winston.transports.Console()],
			format: winston.format.combine(
				winston.format.timestamp({ format: 'MM/DD/YYYY HH:mm:ss' }),
				winston.format.printf(log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`)
			)
		});
		this.fonts = new Collection();
		this.redis = Redis ? Redis.db : null;
		this.webhook = new WebhookClient(
			{ id: XIAO_WEBHOOK_ID, token: XIAO_WEBHOOK_TOKEN },
			{ disableMentions: 'everyone' }
		);
		this.timers = new TimerManager(this);
		this.botList = new BotList(this);
		this.pokemon = new PokemonStore();
		this.games = new Collection();
		this.dispatchers = new Map();
		this.cleverbots = new Map();
		this.phone = new PhoneManager(this);
		this.activities = activities;
		this.leaveMessages = leaveMsgs;
		this.adultSiteList = null;
		this.nsfwModel = null;
	}

	async registerFontsIn(filepath) {
		const files = fs.readdirSync(filepath);
		for (const file of files) {
			const metadata = await fontFinder.get(path.join(filepath, file));
			const font = new Font(path.join(filepath, file), file, metadata);
			this.fonts.set(file, font);
			font.register();
		}
		return this.fonts;
	}

	setTimezones() {
		moment.tz.link('America/Vancouver|Neopia');
		moment.tz.link('America/Los_Angeles|Discord');
		moment.tz.link('America/New_York|Dragon');
	}

	async fetchAdultSiteList(force = false) {
		if (!force && this.adultSiteList) return this.adultSiteList;
		const { text } = await request
			.get('https://raw.githubusercontent.com/blocklistproject/Lists/master/alt-version/porn-nl.txt');
		this.adultSiteList = text.split('\n').filter(site => site && !site.startsWith('#'));
		setTimeout(() => this.fetchAdultSiteList(true), 8.64e+7);
		return this.adultSiteList;
	}

	async loadNSFWModel() {
		const model = await nsfw.load(
			`${url.pathToFileURL(path.join(__dirname, '..', 'tf_models', 'nsfw', 'web_model')).href}/`,
			{ type: 'graph' }
		);
		this.nsfwModel = model;
		return this.nsfwModel;
	}

	fetchReportChannel() {
		if (!REPORT_CHANNEL_ID) return null;
		return this.channels.fetch(REPORT_CHANNEL_ID);
	}

	fetchJoinLeaveChannel() {
		if (!JOIN_LEAVE_CHANNEL_ID) return null;
		return this.channels.fetch(JOIN_LEAVE_CHANNEL_ID);
	}

	fetchCommandChannel() {
		if (!COMMAND_CHANNEL_ID) return null;
		return this.channels.fetch(COMMAND_CHANNEL_ID);
	}
};
