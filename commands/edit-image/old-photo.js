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
		ctx.drawImage(data, 0, 0);
		vignette(ctx, data.width, data.height);
		sepia(ctx, 0, 0, data.width, data.height);
		grain(ctx, 0, 0, data.width, data.height);
		this.stains(ctx, data.width, data.height);
		this.tears(ctx, data.width, data.height);
		this.wrinkles(ctx, data.width, data.height);
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'old-photo.png' }] });
	}

	stains(ctx, width, height, count = 5) {
		for (let i = 0; i < count; i++) {
			const x = Math.random() * width;
			const y = Math.random() * height;
			const radius = 40 + Math.random() * 80;
			const type = Math.random() > 0.5 ? 'coffee' : 'water';
			ctx.beginPath();
			ctx.moveTo(x + radius * 0.6, y);
			for (let angle = 0; angle < 360; angle += Math.random() * 45) {
				const angleRad = (angle * Math.PI) / 180;
				const nextAngleRad = ((angle + Math.random() * 45) * Math.PI) / 180;
				const arcRadius = radius * (0.6 + Math.random() * 0.4);
				ctx.arc(x, y, arcRadius, angleRad, nextAngleRad, false);
			}
			ctx.closePath();
			const baseColor = type === 'coffee' ? [101, 67, 33] : [173, 216, 230];
			const opacity = type === 'coffee' ? 0.6 : 0.3;
			const gradient = ctx.createRadialGradient(x, y, radius * 0.1, x, y, radius);
			gradient.addColorStop(0, `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${opacity})`);
			gradient.addColorStop(1, `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0)`);
			ctx.fillStyle = gradient;
			ctx.fill();
		}
		return ctx;
	}

	tears(ctx, width, height, count = 3) {
		for (let i = 0; i < count; i++) {
			const x = Math.random() * width * 0.8 + width * 0.1;
			const yStart = Math.random() * height;
			const yEnd = yStart + (Math.random() * 50) + 20;
			ctx.beginPath();
			ctx.moveTo(x, yStart);
			for (let y = yStart; y < yEnd; y += 5) {
				const sway = (Math.random() - 0.5) * 10;
				ctx.lineTo(x + sway, y);
			}
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
			ctx.lineWidth = 2;
			ctx.stroke();
		}
		return ctx;
	}

	wrinkles(ctx, width, height, count = 10) {
		for (let i = 0; i < count; i++) {
			const xStart = Math.random() * width;
			const xEnd = (xStart + (Math.random() * width)) - xStart;
			const y = Math.random() * height;
			ctx.beginPath();
			ctx.moveTo(xStart, y);
			for (let x = xStart; x < xEnd; x += 10) {
				const sway = (Math.random() - 0.5) * 20;
				ctx.lineTo(x, y + sway);
			}
			ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
			ctx.lineWidth = 1;
			ctx.stroke();
		}
		return ctx;
	}
};
