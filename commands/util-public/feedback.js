const Command = require('../../framework/Command');

module.exports = class FeedbackCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'feedback',
			group: 'util-public',
			description: 'Shortcut to send feedback.',
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
		return this.client.registry.commands.get('report').run(msg, { reason: 'feedback', message });
	}
};
