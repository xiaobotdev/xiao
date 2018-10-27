const Command = require('../../structures/Command');
const path = require('path');

module.exports = class NomCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nom',
			aliases: ['kanna-crab'],
			group: 'single',
			memberName: 'nom',
			description: 'Posts a GIF of Kanna eating a crab.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'nom.gif')] });
	}
};
