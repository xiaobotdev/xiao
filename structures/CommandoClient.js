const { Client } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { DBOTS_KEY, DBOTSORG_KEY } = process.env;

class CommandoClient extends Client {
	constructor(options) {
		super(options);

		Object.defineProperty(this, 'dBotsToken', { value: DBOTS_KEY });
		Object.defineProperty(this, 'dBotsOrgToken', { value: DBOTSORG_KEY });

		this.on('guildCreate', () => {
			this.dBots();
			this.dBotsOrg();
		});
		this.on('guildDelete', () => {
			this.dBots();
			this.dBotsOrg();
		});
	}

	async dBots() {
		if (!this.dBotsToken) return null;
		try {
			const { body } = await snekfetch
				.post(`https://bots.discord.pw/api/bots/${this.user.id}/stats`)
				.set({ Authorization: this.dBotsToken })
				.send({
					shard_id: this.shard ? this.shard.id : 0,
					shard_count: this.options.shardCount || 1,
					server_count: this.guilds.size
				});
			return body;
		} catch (err) {
			this.emit('error', 'Failed to post to Discord Bots', err);
			return null;
		}
	}

	async dBotsOrg() {
		if (!this.dBotsOrgToken) return null;
		try {
			const { body } = await snekfetch
				.post(`https://discordbots.org/api/bots/${this.user.id}/stats`)
				.set({ Authorization: this.dBotsOrgToken })
				.send({
					shard_id: this.shard ? this.shard.id : 0,
					shard_count: this.options.shardCount || 1,
					server_count: this.guilds.size
				});
			return body;
		} catch (err) {
			this.emit('error', 'Failed to post to Discord Bots Org', err);
			return null;
		}
	}
}

module.exports = CommandoClient;
