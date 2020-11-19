const Redis = require('ioredis');
const { REDIS_HOST, REDIS_PASS } = process.env;
const redis = new Redis({
	port: 6379,
	host: REDIS_HOST,
	enableReadyCheck: true,
	password: REDIS_PASS,
	db: 0
});

module.exports = class RedisClient {
	static get db() {
		return redis;
	}

	static start() {
		redis.on('connect', () => console.info('[REDIS][CONNECT]: Connecting...'));
		redis.on('ready', () => console.info('[REDIS][READY]: Ready!'));
		redis.on('error', error => console.error(`[REDIS][ERROR]: Encountered error:\n${error}`));
		redis.on('reconnecting', () => console.warn('[REDIS][RECONNECT]: Reconnecting...'));
	}
};
