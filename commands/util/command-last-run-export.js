const Command = require('../../framework/Command');

module.exports = class CommandLastRunExportCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'command-last-run-export',
			aliases: [
				'lr-export',
				'lrlb-export',
				'last-run-export',
				'cmd-lr-export',
				'cmd-last-run-export',
				'command-lr-export',
				'export-cmd-lr',
				'export-cmd-last-run',
				'export-command-lr',
				'export-command-last-run',
				'export-lr',
				'export-lrlb',
				'export-last-run'
			],
			group: 'util',
			description: 'Exports a command last run JSON file.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true
		});
	}

	async run(msg) {
		const result = this.client.exportLastRun();
		if (msg.guild) await msg.say('📬 Sent `command-last-run.json` to your DMs!');
		return msg.direct({ files: [{ attachment: result, name: 'command-last-run.json' }] });
	}
};
