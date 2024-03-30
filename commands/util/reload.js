const Command = require('../../framework/Command');

module.exports = class ReloadCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reload',
			aliases: ['reload-command', 'reload-cmd'],
			group: 'util',
			memberName: 'reload',
			description: 'Reloads a command.',
			details: 'Only the bot owner(s) may use this command.',
			guarded: true,
			ownerOnly: true,
			args: [
				{
					key: 'command',
					label: 'command',
					type: 'command'
				}
			]
		});
	}

	run(msg, { command }) {
		this.client.exportCommandLeaderboard();
		this.client.exportLastRun();
		command.reload();
		this.client.importCommandLeaderboard();
		this.client.importLastRun();
		return msg.say(`Reloaded the \`${command.name}\` command.`);
	}
};
