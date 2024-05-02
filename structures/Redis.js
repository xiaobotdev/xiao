const Redis = require('ioredis');
const { REDIS_HOST, REDIS_PASS } = process.env;

module.exports = class RedisClient {
	constructor(client, host = REDIS_HOST, pass = REDIS_PASS) {
		Object.defineProperty(this, 'client', { value: client });

		this.db = new Redis({
			port: 6379,
			host,
			enableReadyCheck: true,
			password: pass,
			db: 0
		});
		this.db.on('connect', () => this.client.logger.info('[REDIS] Connecting...'));
		this.db.on('ready', () => this.client.logger.info('[REDIS] Ready!'));
		this.db.on('error', error => this.client.logger.error(`[REDIS] Encountered error:\n${error}`));
		this.db.on('reconnecting', () => this.client.logger.warn('[REDIS] Reconnecting...'));
	}
};
