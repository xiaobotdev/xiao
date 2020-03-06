const Command = require('../../structures/Command');

module.exports = class RestartCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'restart',
			aliases: ['die', 'explode', 'shutdown', 'process.exit'],
			group: 'util',
			memberName: 'restart',
			description: 'Restarts the bot.',
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

	run(msg, { code }) {
		this.client.logger.info('[RESTART] Manually restarted.');
		process.exit(code);
		return null;
	}
};
