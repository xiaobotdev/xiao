const Command = require('../../structures/Command');
const path = require('path');

module.exports = class SourceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'source',
			aliases: ['sauce'],
			group: 'single',
			memberName: 'source',
			description: 'Hello! Can you give me the source?',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'source.png')] });
	}
};
