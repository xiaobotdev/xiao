const Command = require('../../framework/Command');

module.exports = class SuggestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'suggest',
			aliases: ['suggestion'],
			group: 'util-public',
			description: 'Shortcut to suggest new features.',
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
		return this.client.registry.commands.get('report').run(msg, { reason: 'suggestion', message });
	}
};
