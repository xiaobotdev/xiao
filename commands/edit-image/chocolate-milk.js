const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class ChocolateMilkCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'chocolate-milk',
			aliases: ['milk', 'sip-milk', 'sip-chocolate-milk', 'choccy', 'sip-choccy'],
			group: 'edit-image',
			memberName: 'chocolate-milk',
			description: 'Draws an image or user\'s avatar holding chocolate milk.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 1024 })
				},
				{
					key: 'direction',
					type: 'string',
					oneOf: ['left', 'right'],
					default: 'left',
					parse: direction => direction.toLowerCase()
				}
			]
		});
	}

	async run(msg, { image, direction }) {
		const overlay = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'chocolate-milk.png'));
		const { body } = await request.get(image);
		const base = await loadImage(body);
		const canvas = createCanvas(overlay.width, overlay.height);
		const scaleH = overlay.width / base.width;
		const height = Math.round(base.height * scaleH);
		const ctx = canvas.getContext('2d');
		ctx.fillRect(0, 0, overlay.width, overlay.height);
		if (direction === 'right') {
			ctx.translate(overlay.width, 0);
			ctx.scale(-1, 1);
		}
		ctx.drawImage(base, 0, 0, overlay.width, height);
		if (direction === 'right') ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.drawImage(overlay, 0, 0);
		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
		return msg.say({ files: [{ attachment, name: 'chocolate-milk.png' }] });
	}
};
