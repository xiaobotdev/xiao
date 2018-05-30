const Command = require('../../structures/Command');

module.exports = class WynautCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wynaut',
			aliases: ['why-not'],
			group: 'single',
			memberName: 'wynaut',
			description: 'Why not? Wynaut?',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: ['https://i.imgur.com/6ew9ysx.png'] });
	}
};
