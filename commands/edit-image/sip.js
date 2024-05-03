const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class SipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sip',
			aliases: ['tea', 'sip-tea'],
			group: 'edit-image',
			memberName: 'sip',
			description: 'Draws a user\'s avatar sipping tea.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'CoolClips.com',
					url: 'http://search.coolclips.com/',
					reason: 'Image',
					reasonURL: 'http://search.coolclips.com/m/vector/hand0007/Hands-holding-mug/'
				}
			],
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
		const overlay = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'sip.png'));
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
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
		return msg.say({ files: [{ attachment, name: 'sip.png' }] });
	}
};
