const Command = require('../../framework/Command');

module.exports = class NoopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'noop',
			aliases: ['no-op', 'nop'],
			group: 'other',
			memberName: 'noop',
			description: 'Does nothing.'
		});
	}

	run() {
		return; // eslint-disable-line no-useless-return
	}
};
