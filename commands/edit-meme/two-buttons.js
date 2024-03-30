const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class TwoButtonsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'two-buttons',
			aliases: ['buttons'],
			group: 'edit-meme',
			memberName: 'two-buttons',
			description: 'Sends a "Two Buttons" meme with the buttons of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				},
				{
					name: 'Jake Clark',
					url: 'https://jake-clark.tumblr.com/',
					reason: 'Image',
					reasonURL: 'https://twitter.com/jakeclarkdude/status/689141113584619524'
				}
			],
			args: [
				{
					key: 'first',
					type: 'string',
					max: 280
				},
				{
					key: 'second',
					type: 'string',
					max: 280
				}
			]
		});
	}

	async run(msg, { first, second }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'two-buttons.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.textBaseline = 'top';
		ctx.drawImage(base, 0, 0);
		ctx.rotate(-12 * (Math.PI / 180));
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(34);
		let fontSize = 34;
		while (ctx.measureText(first).width > 366) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const firstLines = await wrapText(ctx, first, 183);
		let lineOffset = 0;
		for (let i = 0; i < firstLines.length; i++) {
			ctx.fillText(firstLines[i], 25 + lineOffset, 116 + (fontSize * i) + (10 * i), 183);
			lineOffset += 5;
		}
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(34);
		fontSize = 34;
		while (ctx.measureText(second).width > 244) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const secondLines = await wrapText(ctx, second, 118);
		lineOffset = 0;
		for (let i = 0; i < secondLines.length; i++) {
			ctx.fillText(secondLines[i], 254 + lineOffset, 130 + (fontSize * i) + (10 * i), 118);
			lineOffset += 5;
		}
		ctx.rotate(12 * (Math.PI / 180));
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'two-buttons.png' }] });
	}
};
