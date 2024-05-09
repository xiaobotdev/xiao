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
			memberName: 'old-photo',
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
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		vignette(ctx, data.width, data.height);
		sepia(ctx, 0, 0, data.width, data.height);
		grain(ctx, 0, 0, data.width, data.height);
		this.stains(ctx, data.width, data.height);
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'old-photo.png' }] });
	}

	stains(ctx, width, height, count = 5) {
		for (let i = 0; i < count; i++) {
			const x = Math.random() * width;
			const y = Math.random() * height;
			const radius = 30 + (Math.random() * 70);
			const r = 100 + (Math.random() * 55);
			const g = 85 + (Math.random() * 70);
			const b = 50 + (Math.random() * 30);
			const color = `rgba(${r}, ${g}, ${b}, ${0.1 + (Math.random() * 0.4)})`;
			ctx.beginPath();
			const angleStep = (Math.PI * 2) / 10;
			for (let angle = 0; angle < Math.PI * 2; angle += angleStep) {
				const modRadius = radius + (Math.random() * 15);
				ctx.lineTo(x + (modRadius * Math.cos(angle)), y + (modRadius * Math.sin(angle)));
			}
			ctx.closePath();
			const gradient = ctx.createRadialGradient(x, y, radius * 0.1, x, y, radius);
			gradient.addColorStop(0, color);
			const r2 = 100 + (Math.random() * 55);
			const g2 = 85 + (Math.random() * 70);
			const b2 = 50 + (Math.random() * 30);
			gradient.addColorStop(1, `rgba(${r2}, ${g2}, ${b2}, 0)`);
			ctx.fillStyle = gradient;
			ctx.fill();
		}
		return ctx;
	}
};
