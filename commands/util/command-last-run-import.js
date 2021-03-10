const Command = require('../../structures/Command');

module.exports = class CommandLastRunImportCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'command-last-run-import',
			aliases: [
				'lr-import',
				'lrlb-import',
				'last-run-import',
				'cmd-lr-import',
				'cmd-last-run-import',
				'command-lr-import',
				'import-cmd-lr',
				'import-cmd-last-run',
				'import-command-lr',
				'import-command-last-run',
				'import-lr',
				'import-lrlb',
				'import-last-run'
			],
			group: 'util',
			memberName: 'command-last-run-import',
			description: 'Imports a command last run JSON file.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true
		});
	}

	run(msg) {
		try {
			const results = this.client.importLastRun();
			if (!results) return msg.reply('The JSON file provided is invalid.');
			return msg.say('Successfully imported command last run.');
		} catch (err) {
			return msg.reply(`Could not read \`command-last-run.json\`: \`${err.message}\`.`);
		}
	}
};
