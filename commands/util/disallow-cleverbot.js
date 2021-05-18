const Command = require('../../structures/Command');
const { removeFromArray } = require('../../util/Util');

module.exports = class DisallowCleverbotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'disallow-cleverbot',
			aliases: ['disallow-clevs'],
			group: 'util',
			memberName: 'disallow-cleverbot',
			description: 'Disallows a user from using Cleverbot.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true,
			args: [
				{
					key: 'target',
					prompt: 'Who do you want to disallow? Use the ID.',
					type: 'string'
				}
			]
		});
	}

	run(msg, { target }) {
		if (!this.client.allowedUsers.includes(target)) return msg.say(`🧠 \`${target}\` is not allowed.`);
		removeFromArray(this.client.allowedUsers, target);
		this.client.exportCleverbotAllowed();
		return msg.say(`🧠 Disallowed \`${target}\` from using Cleverbot.`);
	}
};
