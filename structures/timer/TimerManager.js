const Redis = require('../Redis');

module.exports = class TimerManager {
	constructor(client) {
		Object.defineProperty(this, 'client', { value: client });
	}

	async fetchAll() {
		const timers = await Redis.db.hgetall('timer');
		for (let data of Object.values(timers)) {
			data = JSON.parse(data);
			await this.setTimer(data.channelID, new Date(data.time) - new Date(), data.userID, data.title, false);
		}
		return this;
	}

	async setTimer(channelID, time, userID, title, updateRedis = true) {
		const data = { time: new Date(Date.now() + time).toISOString(), channelID, userID, title };
		const timeout = setTimeout(async () => {
			try {
				const channel = await this.client.channels.fetch(channelID);
				await channel.send(`🕰️ <@${userID}>, you wanted me to remind you of: **"${title}"**.`);
			} finally {
				await Redis.db.hdel('timer', `${channelID}-${userID}`);
			}
		}, time);
		if (updateRedis) await Redis.db.hset('timer', { [`${channelID}-${userID}`]: JSON.stringify(data) });
		return timeout;
	}

	exists(channelID, userID) {
		return Redis.db.hexists('timer', `${channelID}-${userID}`);
	}
};
