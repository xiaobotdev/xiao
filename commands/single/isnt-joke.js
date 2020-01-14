const Command = require('../../structures/Command');
const path = require('path');

module.exports = class IsntJokeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'isnt-joke',
			aliases: ['its-not-joke'],
			group: 'single',
			memberName: 'isnt-joke',
			description: 'Isn\'t joke...',
			clientPermissions: ['ATTACH_FILES'],
			url: [
				{
					name: 'Love Live! School Idol Project',
					url: 'http://www.lovelive-anime.jp/',
					reason: 'Original Anime'
				}
			]
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'isnt-joke.png')] });
	}
};
