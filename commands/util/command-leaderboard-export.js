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
		let text = '{';
		for (const command of this.client.registry.commands.values()) {
			if (command.uses === undefined) continue;
			text += `"${command.name}":${command.uses},`;
		}
		text = text.slice(0, -1);
		text += '}';
		fs.writeFileSync(path.join(__dirname, '..', '..', 'command-leaderboard.json'), Buffer.from(text), {
			encoding: 'utf8'
		});
		return msg.say({ files: [{ attachment: Buffer.from(text), name: 'command-leaderboard.json' }] });
	}
};
