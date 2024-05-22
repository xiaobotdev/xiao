const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class LisaPresentationCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lisa-presentation',
			aliases: ['lisa'],
			group: 'edit-meme',
			description: 'Sends a "Lisa Presentation" meme with the presentation of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: '20th Century Fox',
					url: 'https://www.foxmovies.com/',
					reason: 'Image, Original "The Simpsons" Show',
					reasonURL: 'http://www.simpsonsworld.com/'
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
					key: 'text',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'lisa-presentation.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(40);
		let fontSize = 40;
		while (ctx.measureText(text).width > 1320) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const lines = wrapText(ctx, text, 330);
		const topMost = 185 - (((fontSize * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			const height = topMost + ((fontSize + 20) * i);
			ctx.fillText(lines[i], base.width / 2, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'lisa-presentation.png' }] });
	}
};
