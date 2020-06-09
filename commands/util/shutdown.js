const Command = require('../../structures/Command');

module.exports = class ShutdownCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shutdown',
			aliases: ['die', 'restart', 'process.exit'],
			group: 'util',
			memberName: 'shutdown',
			description: 'Shuts down the bot.',
			details: 'Only the bot owner(s) may use this command.',
			guarded: true,
			ownerOnly: true,
			args: [
				{
					key: 'code',
					prompt: 'What code do you want to send to `process.exit`?',
					type: 'integer',
					default: 0
				}
			]
		});
	}

	async run(msg, { code }) {
		try {
			this.uses++;
			this.client.exportCommandLeaderboard();
			this.client.logger.info('[SHUTDOWN] Manual shutdown engaged.');
			await msg.say('Shutting down... :(');
			process.exit(code);
			return null;
		} catch {
			process.exit(code);
			return null;
		}
	}
};
