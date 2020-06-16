const Command = require('../../structures/Command');
const path = require('path');

module.exports = class CaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cave',
			aliases: ['cavern', 'mine'],
			group: 'single',
			memberName: 'cave',
			description: 'Sends a Minecraft cave that blends in with the chat.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'cave.png')] });
	}
};
