const Command = require('../../framework/Command');

module.exports = class ReloadCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reload',
			aliases: ['reload-command', 'reload-cmd'],
			group: 'util',
			description: 'Reloads a command.',
			details: 'Only the bot owner(s) may use this command.',
			guarded: true,
			ownerOnly: true,
			args: [
				{
					key: 'command',
					label: 'command',
					type: 'command',
					default: ''
				}
			]
		});
	}

	run(msg, { command }) {
		this.client.exportCommandLeaderboard();
		this.client.exportLastRun();
		if (command) {
			command.reload();
		} else {
			for (const cmd of this.client.registry.commands.values()) {
				cmd.reload();
			}
		}
		this.client.importCommandLeaderboard();
		this.client.importLastRun();
		this.client.registry.commands.get('cloc').cache = null;
		if (!command) return msg.say('Reloaded all commands.');
		return msg.say(`Reloaded the \`${command.name}\` command.`);
	}
};
