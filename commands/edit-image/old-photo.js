const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const { vignette, sepia, grain } = require('../../util/Canvas');

module.exports = class OldPhotoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'old-photo',
			aliases: ['old', 'old-timey'],
			group: 'edit-image',
			description: 'Draws an image or a user\'s avatar as an old-timey photo.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 512,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { image }) {
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		vignette(ctx, data.width, data.height);
		sepia(ctx, 0, 0, data.width, data.height);
		grain(ctx, 0, 0, data.width, data.height);
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'old-photo.png' }] });
	}
};
