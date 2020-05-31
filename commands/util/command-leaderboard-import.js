const Command = require('../../structures/Command');

module.exports = class CommandLeaderboardImportCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'command-leaderboard-import',
			aliases: [
				'cmd-lb-import',
				'cmd-leaderboard-import',
				'command-lb-import',
				'import-cmd-lb',
				'import-cmd-leaderboard',
				'import-command-lb',
				'import-command-leaderboard'
			],
			group: 'util',
			memberName: 'command-leaderboard-import',
			description: 'Imports a command leaderboard JSON file.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true,
			args: [
				{
					key: 'file',
					prompt: 'What file do you want to provide?',
					type: 'json-file'
				}
			]
		});
	}

	run(msg, { file }) {
		if (typeof file !== 'object' || Array.isArray(file)) return msg.reply('Please provide a valid JSON file.');
		for (const [id, value] of Object.entries(file)) {
			if (typeof value !== 'number') continue;
			const found = this.client.registry.commands.get(id);
			if (!found || found.uses === undefined) continue;
			found.uses += value;
		}
		return msg.say('Successfully imported command leaderboard.');
	}
};
