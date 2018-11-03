const Command = require('../../structures/Command');
const path = require('path');
const { list } = require('../../util/Util');
const types = ['default', 'blank'];

module.exports = class FlyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fly',
			group: 'single',
			memberName: 'fly',
			description: 'Sends a fake fly that looks surprisngly real.',
			details: `**Types:** ${types.join(', ')}`,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'type',
					prompt: `What type of meme do you want to use? Either ${list(types, 'or')}.`,
					type: 'string',
					default: 'default',
					oneOf: types,
					parse: type => type.toLowerCase()
				}
			]
		});
	}

	run(msg, { type }) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'fly', `${type}.png`)] });
	}
};
