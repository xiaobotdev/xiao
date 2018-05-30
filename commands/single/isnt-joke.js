const Command = require('../../structures/Command');

module.exports = class IsntJokeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'isnt-joke',
			aliases: ['its-not-joke'],
			group: 'single',
			memberName: 'isnt-joke',
			description: 'Isn\'t joke...',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: ['https://i.imgur.com/QdDAeZF.jpg'] });
	}
};
