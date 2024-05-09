const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class BottomTextCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bottom-text',
			group: 'edit-meme',
			memberName: 'bottom-text',
			description: 'Sends a bottom text meme.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'ShareFonts.net',
					url: 'https://www.wfonts.com/',
					reason: 'Impact Font',
					reasonURL: 'https://www.wfonts.com/font/impact'
				}
			],
			args: [
				{
					key: 'top',
					type: 'string',
					max: 50,
					parse: top => top.toUpperCase()
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 512,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512 })
				}
			]
		});
	}

	run(msg, { top, image }) {
		return this.client.registry.commands.get('meme-gen').run(msg, { top, bottom: 'BOTTOM TEXT', image });
	}
};
