const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { wrapText, greyscale, drawImageWithTint } = require('../../util/Canvas');

module.exports = class NikeAdCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nike-ad',
			aliases: ['believe-in-something', 'believe-in'],
			group: 'edit-meme',
			description: 'Sends a "Believe in Something" Nike Ad meme with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Nike',
					url: 'https://www.nike.com/',
					reason: 'Logo, Concept'
				},
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				}
			],
			args: [
				{
					key: 'something',
					type: 'string',
					max: 50
				},
				{
					key: 'sacrifice',
					type: 'string',
					max: 50
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

	async run(msg, { image, something, sacrifice }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'nike-ad.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		drawImageWithTint(ctx, data, 'black', 0, 0, data.width, data.height);
		greyscale(ctx, 0, 0, data.width, data.height);
		const ratio = base.width / base.height;
		const width = data.width / 3;
		const height = Math.round(width / ratio);
		ctx.drawImage(base, (data.width / 2) - (width / 2), data.height - height, width, height);
		const fontSize = Math.round(data.height / 25);
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		const lines = wrapText(ctx, `Believe in ${something}. Even if it means ${sacrifice}.`, data.width - 20);
		if (!lines) return msg.reply('There\'s not enough width to make a Nike ad with this image.');
		const initial = data.height / 2;
		for (let i = 0; i < lines.length; i++) {
			const textHeight = initial + (i * fontSize) + (i * 10);
			ctx.fillText(lines[i], data.width / 2, textHeight);
		}
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'nike-ad.png' }] });
	}
};
