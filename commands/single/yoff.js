const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const path = require('path');
const types = ['default', 'blastyoff', 'disyoffjs', 'yoffcirius', 'yoffice', 'yofficer', 'gameyoff'];

module.exports = class YoffCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yoff',
			group: 'single',
			description: 'Posts a picture that truly defines modern art.',
			clientPermissions: [PermissionFlagsBits.AttachFiles],
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
