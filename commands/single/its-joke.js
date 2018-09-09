const Command = require('../../structures/Command');
const path = require('path');

module.exports = class ItsJokeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'its-joke',
			aliases: ['is-joke'],
			group: 'single',
			memberName: 'its-joke',
			description: 'It\'s joke!',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'its-joke.png')] });
	}
};
