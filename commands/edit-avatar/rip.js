const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { greyscale } = require('../../util/Canvas');

module.exports = class RipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rip',
			aliases: ['grave', 'grave-stone', 'rest-in-peace'],
			group: 'edit-avatar',
			memberName: 'rip',
			description: 'Draws a user\'s avatar over a gravestone.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'vician',
					url: 'https://www.123rf.com/profile_vician',
					reason: 'Image',
					reasonURL: 'https://www.123rf.com/profile_vician?mediapopup=13181623'
				},
				{
					name: 'Iconian Fonts',
					url: 'https://www.fontspace.com/iconian-fonts',
					reason: 'Coffin Stone Font',
					reasonURL: 'https://www.fontspace.com/coffin-stone-font-f40998'
				}
			],
			args: [
				{
					key: 'user',
					type: 'user',
					default: msg => msg.author
				},
				{
					key: 'cause',
					label: 'cause of death',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, { user, cause }) {
		if (!cause) {
			const currentYear = new Date().getFullYear();
			const createdYear = user.createdAt.getFullYear();
			cause = `${createdYear}-${currentYear}`;
		}
		const avatarURL = user.displayAvatarURL({ extension: 'png', size: 512 });
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'rip.png'));
		const { body } = await request.get(avatarURL);
		const avatar = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.drawImage(avatar, 194, 399, 500, 500);
		greyscale(ctx, 194, 399, 500, 500);
		ctx.textBaseline = 'top';
		ctx.textAlign = 'center';
		ctx.font = this.client.fonts.get('CoffinStone.otf').toCanvasString(62);
		this.fillPressedText(ctx, user.username, 438, 330, 500);
		if (cause) this.fillPressedText(ctx, cause, 438, 920, 500);
		ctx.font = this.client.fonts.get('CoffinStone.otf').toCanvasString(37);
		this.fillPressedText(ctx, 'In Loving Memory of', 438, 292);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'rip.png' }] });
	}

	fillPressedText(ctx, text, x, y, maxWidth) {
		ctx.shadowColor = '#666666';
		ctx.shadowOffsetX = -2;
		ctx.shadowOffsetY = -2;
		ctx.shadowBlur = 2;
		ctx.fillStyle = '#333333';
		ctx.fillText(text, x, y, maxWidth);
		ctx.shadowColor = '#FFFFFF';
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.shadowBlur = 2;
		ctx.fillText(text, x, y, maxWidth);
		ctx.fillStyle = '#999999';
		ctx.shadowColor = 'transparent';
		ctx.fillText(text, x, y, maxWidth);
		return ctx;
	}
};
