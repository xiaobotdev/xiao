const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class ThatSignWontStopMeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'that-sign-wont-stop-me',
			aliases: ['sign-wont-stop-me', 'i-cant-read', 'because-i-cant-read', 'dw-sign'],
			group: 'edit-meme',
			memberName: 'that-sign-wont-stop-me',
			description: 'Sends a "That Sign Won\'t Stop Me, I Can\'t read!" meme with the presentation of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'PBS Kids',
					url: 'https://pbskids.org/',
					reason: 'Image, Original "Arthur" Show',
					reasonURL: 'https://pbskids.org/arthur/'
				},
				{
					name: 'Missy Meyer',
					url: 'https://missymeyer.com/',
					reason: 'Tragic Marker Font',
					reasonURL: 'https://missymeyer.com/tragic-marker-free-font'
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'that-sign-wont-stop-me.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('TragicMarker.otf').toCanvasString(62);
		let fontSize = 62;
		while (ctx.measureText(text).width > 1002) {
			fontSize--;
			ctx.font = this.client.fonts.get('TragicMarker.otf').toCanvasString(fontSize);
		}
		const lines = await wrapText(ctx, text, 334);
		const topMost = 240 - (((fontSize * lines.length) / 2) + ((10 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			const height = topMost + ((fontSize + 10) * i);
			ctx.fillText(lines[i], 210, height);
		}
		ctx.font = this.client.fonts.get('TragicMarker.otf').toCanvasString(16);
		fontSize = 16;
		while (ctx.measureText(text).width > 264) {
			fontSize--;
			ctx.font = this.client.fonts.get('TragicMarker.otf').toCanvasString(fontSize);
		}
		const bLines = await wrapText(ctx, text, 88);
		const bTopMost = 645 - (((fontSize * bLines.length) / 2) + ((2 * (bLines.length - 1)) / 2));
		for (let i = 0; i < bLines.length; i++) {
			const height = bTopMost + ((fontSize + 2) * i);
			ctx.fillText(bLines[i], 280, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'that-sign-wont-stop-me.png' }] });
	}
};
