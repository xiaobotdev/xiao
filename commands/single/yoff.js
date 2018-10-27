const Command = require('../../structures/Command');
const path = require('path');

module.exports = class SourceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yoff',
			group: 'single',
			memberName: 'yoff',
			description: 'Posts a picture that truly defines modern art.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'yoff.png')] });
	}
};
