const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class WhiteboardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'whiteboard',
			group: 'edit-meme',
			description: 'Sends a "Jim Halpert point to whiteboard" meme with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'NBC',
					url: 'https://www.nbc.com/',
					reason: 'Image, Original "The Office" TV Series',
					reasonURL: 'https://www.nbc.com/the-office'
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
					key: 'initial',
					type: 'string',
					max: 500
				},
				{
					key: 'resolved',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { initial, resolved }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'whiteboard.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(46);
		let fontSize = 46;
		while (ctx.measureText(initial).width > 608) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const initialLines = wrapText(ctx, initial, 405);
		const initialTopMost = 111 - (((fontSize * initialLines.length) / 2) + ((10 * (initialLines.length - 1)) / 2));
		for (let i = 0; i < initialLines.length; i++) {
			const height = initialTopMost + ((fontSize + 10) * i);
			ctx.fillText(initialLines[i], 210, height);
		}
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(40);
		fontSize = 40;
		while (ctx.measureText(resolved).width > 551) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const resolveLines = wrapText(ctx, resolved, 367);
		const resolveTopMost = 500 - (((fontSize * resolveLines.length) / 2) + ((10 * (resolveLines.length - 1)) / 2));
		for (let i = 0; i < resolveLines.length; i++) {
			const height = resolveTopMost + ((fontSize + 10) * i);
			ctx.fillText(resolveLines[i], 195, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'whiteboard.png' }] });
	}
};
