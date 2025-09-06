const Command = require('../../framework/Command');

module.exports = class ReportAbuseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'report-abuse',
			aliases: ['abuse'],
			group: 'util-public',
			description: 'Shortcut to report abuse.',
			guarded: true,
			args: [
				{
					key: 'message',
					type: 'string'
				}
			]
		});
	}

	run(msg, { message }) {
		return this.client.registry.commands.get('report').run(msg, { reason: 3, message });
	}
};
