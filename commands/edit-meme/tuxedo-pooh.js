const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class TuxedoPoohCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tuxedo-pooh',
			aliases: ['tuxedo-winnie', 'tuxedo-winnie-the-pooh', 'tux-pooh', 'tux-winnie', 'tux-winnie-the-pooh'],
			group: 'edit-meme',
			memberName: 'tuxedo-pooh',
			description: 'Sends a "Tuxedo Winnie the Pooh" meme with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Disney',
					url: 'https://www.disney.com/',
					reason: 'Original "Winnie the Pooh" Movie',
					reasonURL: 'https://winniethepooh.disney.com/'
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
					key: 'normal',
					prompt: 'What text should be the normal Pooh?',
					type: 'string',
					max: 500
				},
				{
					key: 'tuxedo',
					prompt: 'What text should be the tuxedo Pooh?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { normal, tuxedo }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'tuxedo-pooh.png'));
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(50);
			let fontSize = 50;
			while (ctx.measureText(normal).width > 1320) {
				fontSize--;
				ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
			}
			const normalLines = await wrapText(ctx, normal, 440);
			const normalTopMost = 145 - (((fontSize * normalLines.length) / 2) + ((10 * (normalLines.length - 1)) / 2));
			for (let i = 0; i < normalLines.length; i++) {
				const height = normalTopMost + ((fontSize + 10) * i);
				ctx.fillText(normalLines[i], 570, height);
			}
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(50);
			fontSize = 50;
			while (ctx.measureText(tuxedo).width > 1320) {
				fontSize--;
				ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
			}
			const tuxedoLines = await wrapText(ctx, tuxedo, 440);
			const tuxedoTopMost = 436 - (((fontSize * tuxedoLines.length) / 2) + ((10 * (tuxedoLines.length - 1)) / 2));
			for (let i = 0; i < tuxedoLines.length; i++) {
				const height = tuxedoTopMost + ((fontSize + 10) * i);
				ctx.fillText(tuxedoLines[i], 570, height);
			}
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'tuxedo-pooh.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
