const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class PillsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pills',
			aliases: ['hard-to-swallow-pills', 'hard-pills'],
			group: 'edit-meme',
			memberName: 'pills',
			description: 'Sends a "Hard to Swallow Pills" meme with the text of your choice.',
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'pills.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(32);
		let fontSize = 32;
		while (ctx.measureText(text).width > 1260) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const lines = await wrapText(ctx, text, 280);
		const topMost = 455 - (((fontSize * lines.length) / 2) + ((10 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			ctx.strokeStyle = 'white';
			ctx.lineWidth = 5;
			const height = topMost + ((fontSize + 10) * i);
			ctx.strokeText(lines[i], 183, height);
			ctx.fillText(lines[i], 183, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'pills.png' }] });
	}
};
