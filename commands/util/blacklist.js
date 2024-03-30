const Command = require('../../framework/Command');
const types = ['user', 'guild'];

module.exports = class BlacklistCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'blacklist',
			group: 'util',
			memberName: 'blacklist',
			description: 'Blacklists a user or server.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true,
			args: [
				{
					key: 'type',
					type: 'string',
					oneOf: types,
					parse: type => type.toLowerCase()
				},
				{
					key: 'target',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { type, target }) {
		if (this.client.blacklist[type].includes(target)) return msg.say(`🔨 \`${target}\` is already blacklisted.`);
		this.client.blacklist[type].push(target);
		this.client.exportBlacklist();
		if (type === 'guild') {
			try {
				const guild = await this.client.guilds.fetch(target, false);
				await guild.leave();
			} catch {
				await msg.say('🔨 Failed to leave guild.');
			}
		}
		if (type === 'user') {
			let guildsLeft = 0;
			const failedToLeave = [];
			for (const guild of this.client.guilds.cache.values()) {
				if (guild.ownerID === target) {
					try {
						await guild.leave();
						guildsLeft++;
					} catch {
						failedToLeave.push(guild.id);
					}
				}
			}
			const formatFailed = failedToLeave.length ? failedToLeave.map(id => `\`${id}\``).join(', ') : '_None_';
			await msg.say(`🔨 Left ${guildsLeft} guilds owner by this user. Failed to leave: ${formatFailed}`);
		}
		return msg.say(`🔨 Blacklisted ${type} \`${target}\`.`);
	}
};
