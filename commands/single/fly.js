const Command = require('../../framework/Command');
const path = require('path');

module.exports = class FlyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fly',
			group: 'single',
			memberName: 'fly',
			description: 'Sends a fake fly that looks surprisngly real.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'fly.png')] });
	}
};
