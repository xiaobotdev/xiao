const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class IfThoseKidsCouldReadCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'if-those-kids-could-read',
			aliases: ['if-those-kids-could', 'itkcr', 'itkc'],
			group: 'edit-meme',
			memberName: 'if-those-kids-could-read',
			description: 'Sends a "If those kids could read, they\'d be very upset" meme with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: '20th Century Fox',
					url: 'https://www.foxmovies.com/',
					reason: 'Image, Original "King of the Hill" Show'
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'if-those-kids-could-read.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(40);
		let fontSize = 40;
		while (ctx.measureText(text).width > 560) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const lines = wrapText(ctx, text, 160);
		const topMost = 140 - (((fontSize * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			const height = topMost + ((fontSize + 20) * i);
			ctx.fillText(lines[i], 300, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'if-those-kids-could-read.png' }] });
	}
};
