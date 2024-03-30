const Command = require('../../framework/Command');
const { list, removeFromArray } = require('../../util/Util');
const types = ['user', 'guild'];

module.exports = class UnblacklistCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unblacklist',
			aliases: ['whitelist'],
			group: 'util',
			memberName: 'unblacklist',
			description: 'Unblacklists a user or server.',
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

	run(msg, { type, target }) {
		if (!this.client.blacklist[type].includes(target)) return msg.say(`🔨 \`${target}\` is not blacklisted.`);
		removeFromArray(this.client.blacklist[type], target);
		this.client.exportBlacklist();
		return msg.say(`🔨 Unblacklisted ${type} \`${target}\`.`);
	}
};
