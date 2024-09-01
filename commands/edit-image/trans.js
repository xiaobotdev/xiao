const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class TransCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'trans',
			aliases: ['transgender'],
			group: 'edit-image',
			description: 'Draws an image or a user\'s avatar but with a Transgender flag on it.',
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
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const transFlag = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'trans.png'));
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		ctx.globalAlpha = 0.75;
		ctx.drawImage(transFlag, 0, 0, data.width, data.height);
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'trans.png' }] });
	}
};
