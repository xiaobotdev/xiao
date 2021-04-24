const Collection = require('@discordjs/collection');
const Timer = require('./Timer');

module.exports = class TimerManager extends Collection {
	constructor(client, options) {
		super(options);

		Object.defineProperty(this, 'client', { value: client });
	}

	async fetchAll() {
		const timers = await this.client.redis.hgetall('timer');
		for (let data of Object.values(timers)) {
			data = JSON.parse(data);
			await this.setTimer(data.id, data.channelID, new Date(data.time) - new Date(), data.userID, data.title, false);
		}
		return this;
	}

	async setTimer(id, channelID, time, userID, title, updateRedis = true) {
		const timer = new Timer(this.client, id, channelID, userID, time, title);
		if (updateRedis) await this.client.redis.hset('timer', { [timer.id]: timer.stringify() });
		this.set(timer.id, timer);
		return timer;
	}

	findAll(channelID, userID) {
		return this.filter(timer => timer.channelID === channelID && timer.userID === userID);
	}
};
