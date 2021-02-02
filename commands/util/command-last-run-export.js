const Command = require('../../structures/Command');

module.exports = class CommandLastRunExportCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'command-last-run-export',
			aliases: [
				'cmd-lr-export',
				'cmd-last-run-export',
				'command-lr-export',
				'export-cmd-lr',
				'export-cmd-last-run',
				'export-command-lr',
				'export-command-last-run'
			],
			group: 'util',
			memberName: 'command-last-run-export',
			description: 'Exports a command last run JSON file.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true
		});
	}

	async run(msg) {
		const result = this.client.exportLastRun();
		await msg.direct({ files: [{ attachment: result, name: 'command-last-run.json' }] });
		return msg.say('📬 Sent `command-last-run.json` to your DMs!');
	}
};
