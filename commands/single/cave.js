const Command = require('../../framework/Command');
const path = require('path');
const { list } = require('../../util/Util');
const types = ['default', 'steve'];

module.exports = class CaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cave',
			aliases: ['cavern', 'mine'],
			group: 'single',
			memberName: 'cave',
			description: 'Sends a Minecraft cave that blends in with the chat.',
			details: `**Types:** ${types.join(', ')}`,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'type',
					prompt: `What type of cave do you want to use? Either ${list(types, 'or')}.`,
					type: 'string',
					default: 'default',
					oneOf: types,
					parse: type => type.toLowerCase()
				}
			]
		});
	}

	run(msg, { type }) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'cave', `${type}.png`)] });
	}
};
