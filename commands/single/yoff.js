const Command = require('../../framework/Command');
const path = require('path');
const types = ['default', 'blastyoff', 'disyoffjs', 'yoffcirius', 'yoffice', 'yofficer', 'gameyoff'];

module.exports = class YoffCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yoff',
			group: 'single',
			memberName: 'yoff',
			description: 'Posts a picture that truly defines modern art.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: '1Computer1',
					url: 'https://github.com/1Computer1',
					reason: 'Images'
				}
			],
			args: [
				{
					key: 'type',
					type: 'string',
					default: 'default',
					oneOf: types,
					parse: type => type.toLowerCase()
				}
			]
		});
	}

	run(msg, { type }) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'yoff', `${type}.png`)] });
	}
};
