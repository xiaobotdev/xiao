const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class SpidermanPointingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'spiderman-pointing',
			aliases: ['spiderman-pointing-at-spiderman', 'spiderman', 'spiderman-point'],
			group: 'edit-meme',
			memberName: 'spiderman-pointing',
			description: 'Sends a "Spiderman Pointing at Spiderman" meme with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Marvel',
					url: 'https://www.marvel.com/',
					reason: 'Image, Original "Spiderman" Comic',
					reasonURL: 'https://spiderman.marvelhq.com/'
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
					key: 'first',
					type: 'string',
					max: 500
				},
				{
					key: 'second',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { first, second }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'spiderman-pointing.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(50);
		ctx.fillStyle = 'white';
		let fontSize = 50;
		while (ctx.measureText(first).width > 725) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const lines = await wrapText(ctx, first, 290);
		const topMost = 189 - (((fontSize * lines.length) / 2) + ((10 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 5;
			const height = topMost + ((fontSize + 10) * i);
			ctx.strokeText(lines[i], 222, height);
			ctx.fillText(lines[i], 222, height);
		}
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(50);
		fontSize = 50;
		while (ctx.measureText(second).width > 725) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const lines2 = await wrapText(ctx, second, 290);
		const topMost2 = 190 - (((fontSize * lines2.length) / 2) + ((10 * (lines2.length - 1)) / 2));
		for (let i = 0; i < lines2.length; i++) {
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 5;
			const height = topMost2 + ((fontSize + 10) * i);
			ctx.strokeText(lines2[i], 596, height);
			ctx.fillText(lines2[i], 596, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'spiderman-pointing.png' }] });
	}
};
