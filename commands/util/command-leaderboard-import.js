const Command = require('../../structures/Command');
const fs = require('fs');
const path = require('path');

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
					type: 'json-file',
					default: ''
				}
			]
		});
	}

	run(msg, { file }) {
		if (!file) {
			try {
				const read = fs.readFileSync(path.join(__dirname, '..', '..', 'command-leaderboard.json'), {
					encoding: 'utf8'
				});
				file = JSON.parse(read);
			} catch (err) {
				return msg.say(`Could not read \`command-leaderboard.json\`: \`${err.message}\`.`);
			}
		}
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
