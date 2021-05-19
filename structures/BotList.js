const request = require('node-superfetch');
const {
	TOP_GG_TOKEN,
	BOTS_GG_TOKEN,
	DISCORDBOTLIST_TOKEN,
	CARBON_TOKEN,
	BLIST_TOKEN
} = process.env;

module.exports = class BotList {
	constructor(client) {
		Object.defineProperty(this, 'client', { value: client });

		this.topGGToken = TOP_GG_TOKEN;
		this.botsGGToken = BOTS_GG_TOKEN;
		this.discordBotsListToken = DISCORDBOTLIST_TOKEN;
		this.carbonToken = CARBON_TOKEN;
		this.blistToken = BLIST_TOKEN;
	}

	async postTopGGStats() {
		if (!this.topGGToken) return null;
		try {
			const { body } = await request
				.post(`https://top.gg/api/bots/${this.client.user.id}/stats`)
				.set({ Authorization: this.topGGToken })
				.send({ server_count: this.client.guilds.cache.size });
			this.client.logger.info('[TOP.GG] Posted stats.');
			return body;
		} catch (err) {
			this.client.logger.error(`[TOP.GG] Failed to post stats:\n${err.stack}`);
			return err;
		}
	}

	async postBotsGGStats() {
		if (!this.botsGGToken) return null;
		try {
			const { body } = await request
				.post(`https://discord.bots.gg/api/v1/bots/${this.client.user.id}/stats`)
				.set({ Authorization: this.botsGGToken })
				.send({ guildCount: this.client.guilds.cache.size });
			this.client.logger.info('[BOTS.GG] Posted stats.');
			return body;
		} catch (err) {
			this.client.logger.error(`[BOTS.GG] Failed to post stats:\n${err.stack}`);
			return err;
		}
	}

	async postDiscordBotListStats() {
		if (!this.discordBotsListToken) return null;
		try {
			const { body } = await request
				.post(`https://discordbotlist.com/api/v1/bots/${this.client.user.id}/stats`)
				.set({ Authorization: this.discordBotsListToken })
				.send({
					guilds: this.client.guilds.cache.size,
					users: this.client.users.cache.size,
					voice_connections: this.client.dispatchers.size
				});
			this.client.logger.info('[DISCORDBOTLIST] Posted stats.');
			return body;
		} catch (err) {
			this.client.logger.error(`[DISCORDBOTLIST] Failed to post stats:\n${err.stack}`);
			return err;
		}
	}

	async postCarbonStats() {
		if (!this.carbonToken) return null;
		try {
			const { body } = await request
				.post('https://www.carbonitex.net/discord/data/botdata.php')
				.send({
					key: this.carbonToken,
					servercount: this.client.guilds.cache.size,
					botid: this.client.user.id
				});
			this.client.logger.info('[CARBON] Posted stats.');
			return body;
		} catch (err) {
			this.client.logger.error(`[CARBON] Failed to post stats:\n${err.stack}`);
			return err;
		}
	}

	async postBlistStats() {
		if (!this.blistToken) return null;
		try {
			const { body } = await request
				.patch(`https://blist.xyz/api/v2/bot/${this.client.user.id}/stats/`)
				.set({ Authorization: this.blistToken })
				.send({ server_count: this.client.guilds.cache.size });
			this.client.logger.info('[BLIST] Posted stats.');
			return body;
		} catch (err) {
			this.client.logger.error(`[BLIST] Failed to post stats:\n${err.stack}`);
			return err;
		}
	}
};
