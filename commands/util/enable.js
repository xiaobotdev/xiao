const Command = require('../../framework/Command');

module.exports = class EnableCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'enable',
			aliases: ['enable-command', 'enable-cmd'],
			group: 'util',
			memberName: 'enable',
			description: 'Enables a command.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true,
			args: [
				{
					key: 'command',
					type: 'command'
				}
			]
		});
	}

	async run(msg, { command }) {
		if (command._enabled) return msg.say(`The \`${command.name}\` command is already enabled.`);
		command.enable();
		await this.client.redis.db.hdel('disabled', command.name);
		return msg.say(`Enabled the \`${command.name}\` command.`);
	}
};
