const crypto = require('crypto');

module.exports = class Timer {
	constructor(client, id, channelID, userID, time, title) {
		Object.defineProperty(this, 'client', { value: client });

		this.id = id || crypto.randomBytes(16).toString('hex');
		this.channelID = channelID;
		this.userID = userID;
		this.time = time;
		this.title = title;
		this.timeout = this.setTimeout(time);
	}

	stringify() {
		return JSON.stringify({
			id: this.id,
			channelID: this.channelID,
			userID: this.userID,
			time: new Date(Date.now() + this.time).toISOString(),
			title: this.title
		});
	}

	setTimeout(time) {
		return setTimeout(async () => {
			try {
				const channel = await this.client.channels.fetch(this.channelID);
				await channel.send(`🕰️ <@${this.userID}>, you wanted me to remind you of: **"${this.title}"**.`);
			} finally {
				await this.client.redis.hdel('timer', id);
			}
		}, time);
	}

	delete() {
		clearTimeout(this.timeout);
		this.client.timers.delete(this.id);
		return this.client.redis.hdel('timer', this.id);
	}
};
