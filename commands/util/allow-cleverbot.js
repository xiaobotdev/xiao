const Command = require('../../structures/Command');

module.exports = class AllowCleverbotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'allow-cleverbot',
			aliases: ['allow-clevs'],
			group: 'util',
			memberName: 'allow-cleverbot',
			description: 'Allows a user to use Cleverbot.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true,
			args: [
				{
					key: 'target',
					prompt: 'Who do you want to allow? Use the ID.',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { target }) {
		if (this.client.allowedUsers.includes(target)) return msg.say(`🧠 \`${target}\` is already allowed.`);
		this.client.allowedUsers.push(target);
		this.client.exportCleverbotAllowed();
		return msg.say(`🧠 Allowed \`${target}\` to use Cleverbot.`);
	}
};
