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
	}

	async postTopGGStats() {
		if (!TOP_GG_TOKEN) return null;
		try {
			const { body } = await request
				.post(`https://top.gg/api/bots/${this.client.user.id}/stats`)
				.set({ Authorization: TOP_GG_TOKEN })
				.send({ server_count: this.client.guilds.cache.size });
			this.client.logger.info('[TOP.GG] Posted stats.');
			return body;
		} catch (err) {
			this.client.logger.error(`[TOP.GG] Failed to post stats:\n${err.stack}`);
			return err;
		}
	}

	async postBotsGGStats() {
		if (!BOTS_GG_TOKEN) return null;
		try {
			const { body } = await request
				.post(`https://discord.bots.gg/api/v1/bots/${this.client.user.id}/stats`)
				.set({ Authorization: BOTS_GG_TOKEN })
				.send({ guildCount: this.client.guilds.cache.size });
			this.client.logger.info('[BOTS.GG] Posted stats.');
			return body;
		} catch (err) {
			this.client.logger.error(`[BOTS.GG] Failed to post stats:\n${err.stack}`);
			return err;
		}
	}

	async postDiscordBotListStats() {
		if (!DISCORDBOTLIST_TOKEN) return null;
		try {
			const { body } = await request
				.post(`https://discordbotlist.com/api/v1/bots/${this.client.user.id}/stats`)
				.set({ Authorization: DISCORDBOTLIST_TOKEN })
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
		if (!CARBON_TOKEN) return null;
		try {
			const { body } = await request
				.post('https://www.carbonitex.net/discord/data/botdata.php')
				.send({
					key: CARBON_TOKEN,
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
		if (!BLIST_TOKEN) return null;
		try {
			const { body } = await request
				.patch(`https://blist.xyz/api/v2/bot/${this.client.user.id}/stats/`)
				.set({ Authorization: BLIST_TOKEN })
				.send({ server_count: this.client.guilds.cache.size });
			this.client.logger.info('[BLIST] Posted stats.');
			return body;
		} catch (err) {
			this.client.logger.error(`[BLIST] Failed to post stats:\n${err.stack}`);
			return err;
		}
	}
};
