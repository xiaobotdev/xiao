const Command = require('../../structures/Command');

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
		return;
	}
};
