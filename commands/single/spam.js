const Command = require('../../structures/Command');

module.exports = class SpamCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'spam',
			group: 'single',
			memberName: 'spam',
			description: 'Responds with a picture of Spam.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: ['https://i.imgur.com/Az9IrXY.jpg'] });
	}
};
