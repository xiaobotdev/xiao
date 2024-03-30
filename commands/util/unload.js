const Command = require('../../framework/Command');

module.exports = class UnloadCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unload',
			aliases: ['unload-command', 'unload-cmd', 'delete-command', 'delete-cmd'],
			group: 'util',
			memberName: 'unload',
			description: 'Unloads a command.',
			details: 'Only the bot owner(s) may use this command.',
			guarded: true,
			ownerOnly: true,
			args: [
				{
					key: 'command',
					type: 'command'
				}
			]
		});
	}

	run(msg, { command }) {
		this.client.registry.commands.delete(command.name);
		this.client.registry.commands.get('cloc').cache = null;
		return msg.say(`Unloaded the \`${command.name}\` command.`);
	}
};
