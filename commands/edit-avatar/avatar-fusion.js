const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');

module.exports = class AvatarFusionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'avatar-fusion',
			aliases: ['avatar-fuse', 'ava-fuse'],
			group: 'edit-avatar',
			description: 'Draws a a user\'s avatar over a user\'s avatar.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			args: [
				{
					key: 'overlay',
					type: 'user'
				},
				{
					key: 'base',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { overlay, base }) {
		const baseAvatarURL = base.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
		const overlayAvatarURL = overlay.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
		const baseAvatarData = await request.get(baseAvatarURL);
		const baseAvatar = await loadImage(baseAvatarData.body);
		const overlayAvatarData = await request.get(overlayAvatarURL);
		const overlayAvatar = await loadImage(overlayAvatarData.body);
		const canvas = createCanvas(baseAvatar.width, baseAvatar.height);
		const ctx = canvas.getContext('2d');
		ctx.globalAlpha = 0.5;
		ctx.drawImage(baseAvatar, 0, 0);
		ctx.drawImage(overlayAvatar, 0, 0, baseAvatar.width, baseAvatar.height);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'avatar-fusion.png' }] });
	}
};
