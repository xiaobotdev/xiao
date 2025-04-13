const Command = require('../../framework/Command');

module.exports = class NoopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'noop',
			aliases: ['no-op', 'nop'],
			group: 'other',
			description: 'Does nothing.',
			sendTyping: false
		});
	}

	run() {
		return; // eslint-disable-line no-useless-return
	}
};
