const CommandClient = require('../framework/Client');
const request = require('node-superfetch');
const { Collection } = require('@discordjs/collection');
const winston = require('winston');
const fontFinder = require('font-finder');
const nsfw = require('nsfwjs');
const tfnode = require('@tensorflow/tfjs-node');
const faceDetection = require('@tensorflow-models/face-detection');
const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
const moment = require('moment-timezone');
const fs = require('fs');
const url = require('url');
const path = require('path');
const Redis = require('./Redis');
const Font = require('./Font');
const PhoneManager = require('./phone/PhoneManager');
const TimerManager = require('./remind/TimerManager');
const PokemonStore = require('./pokemon/PokemonStore');
const activities = require('./activity');
const { REPORT_CHANNEL_ID, JOIN_LEAVE_CHANNEL_ID } = process.env;

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
		this.timers = new TimerManager(this);
		this.pokemon = new PokemonStore();
		this.dispatchers = new Map();
		this.cleverbots = new Map();
		this.phone = new PhoneManager(this);
		this.activities = activities;
		this.adultSiteList = null;
		this.nsfwModel = null;
		this.faceDetector = null;
	}

	async loadParseDomain() {
		const parseDomainModule = await import('parse-domain');
		this.parseDomain = parseDomainModule.parseDomain;
		this.ParseResultType = parseDomainModule.ParseResultType;
		return parseDomainModule;
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
		const nsfwModel = await nsfw.load(
			`${url.pathToFileURL(path.join(__dirname, '..', 'tf_models', 'nsfw', 'web_model')).href}/`,
			{ type: 'graph' }
		);
		this.nsfwModel = nsfwModel;
		return this.nsfwModel;
	}

	async loadFaceDetector() {
		this.faceDetector = await faceDetection.createDetector(model, { runtime: 'tfjs', maxFaces: 10 });
		return this.faceDetector;
	}

	async detectFaces(imgData) {
		if (Buffer.byteLength(imgData) >= 4e+6) return 'size';
		tfnode.setBackend('tensorflow');
		const image = tfnode.node.decodeImage(imgData, 3);
		tfnode.setBackend('cpu');
		const faces = await this.faceDetector.estimateFaces(image);
		tfnode.setBackend('tensorflow');
		if (!faces || !faces.length) return null;
		return faces;
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
