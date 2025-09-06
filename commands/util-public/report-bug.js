const Command = require('../../framework/Command');

module.exports = class ReportBugCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'report-bug',
			aliases: ['bug', 'report-suggestion'],
			group: 'util-public',
			description: 'Shortcut to report a bug.',
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
		return this.client.registry.commands.get('report').run(msg, { reason: 0, message });
	}
};
