const { Client } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { Collection } = require('discord.js');

class CommandoClient extends Client {
	constructor(options) {
		super(options);

		this.guildPruneLevel = options.guildPruneLevel;
		this.guildWhitelist = options.guildWhitelist;
		Object.defineProperty(this, 'dBotsToken', { value: options.dBotsToken });
		Object.defineProperty(this, 'dBotsOrgToken', { value: options.dBotsOrgToken });

		this.on('guildCreate', guild => {
			this.pruneGuilds(guild);
			this.dBots();
			this.dBotsOrg();
		});
		this.on('guildDelete', () => {
			this.dBots();
			this.dBotsOrg();
		});
		this.setInterval(() => this.pruneGuilds(), 600000);
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

	async pruneGuilds(guild) {
		let guilds = new Collection();
		if (typeof guild === 'undefined') {
			for (const g of this.guilds.values()) {
				if (this.guildWhitelist.includes(g.id)) continue;
				if (g.members.filter(member => member.user.bot).size > this.guildPruneLevel) {
					try {
						guilds.set(g.id, g);
						await g.leave();
					} catch (err) {
						this.emit('error', `Failed to leave guild ${g.name}. (${g.id})`, err);
					}
				}
			}
		} else {
			if (this.guildWhitelist.includes(guild.id)) return guilds;
			if (guild.members.filter(member => member.user.bot).size > this.guildPruneLevel) {
				try {
					guilds.set(guild.id, guild);
					await guild.leave();
				} catch (err) {
					this.emit('error', `Failed to leave guild ${g.name}. (${g.id})`, err);
				}
			}
		}
		return guilds;
	}
}

module.exports = CommandoClient;
