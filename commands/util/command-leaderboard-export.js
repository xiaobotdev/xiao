const Command = require('../../structures/Command');
const fs = require('fs');
const path = require('path');

module.exports = class CommandLeaderboardExportCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'command-leaderboard-export',
			aliases: [
				'cmd-lb-export',
				'cmd-leaderboard-export',
				'command-lb-export',
				'export-cmd-lb',
				'export-cmd-leaderboard',
				'export-command-lb',
				'export-command-leaderboard'
			],
			group: 'util',
			memberName: 'command-leaderboard-export',
			description: 'Exports a command leaderboard JSON file.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true
		});
	}

	run(msg) {
		const result = this.client.exportCommandLeaderboard();
		return msg.say({ files: [{ attachment: result, name: 'command-leaderboard.json' }] });
	}
};
