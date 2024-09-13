const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');

module.exports = class SnapchatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'snapchat',
			aliases: ['snap'],
			group: 'edit-image',
			description: 'Creates a fake Snap from Snapchat with the image and text you provide.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				},
				{
					name: 'Snapchat',
					url: 'https://www.snapchat.com/',
					reason: 'Design'
				}
			],
			args: [
				{
					key: 'text',
					type: 'string',
					max: 32
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 512,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { text, image }) {
		const { body } = await request.get(image);
		const base = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(base.height / 24);
		const barHeight = (base.height / 24) * 2;
		const barPosition = base.height - (base.height / 3);
		ctx.globalAlpha = 0.3;
		ctx.fillStyle = 'black';
		ctx.fillRect(0, barPosition - barHeight, base.width, barHeight);
		ctx.globalAlpha = 1;
		ctx.fillStyle = 'white';
		ctx.fillText(text, base.width / 2, barPosition - (barHeight * 0.4));
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'snapchat.png' }] });
	}
};
