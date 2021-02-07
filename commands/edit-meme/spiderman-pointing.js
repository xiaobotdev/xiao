const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class SpidermanPointingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'spiderman-pointing',
			aliases: ['spiderman-pointing-at-spiderman', 'spiderman', 'spiderman-point'],
			group: 'edit-meme',
			memberName: 'spiderman-pointing',
			description: 'Sends a "Spiderman Pointing at Spiderman" meme with the text of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
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
					prompt: 'What should the first spiderman be?',
					type: 'string',
					max: 500
				},
				{
					key: 'second',
					prompt: 'What should the second spiderman be?',
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
		ctx.font = '50px Noto';
		ctx.fillStyle = 'white';
		let fontSize = 50;
		while (ctx.measureText(first).width > 725) {
			fontSize--;
			ctx.font = `${fontSize}px Noto`;
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
		ctx.font = '50px Noto';
		fontSize = 50;
		while (ctx.measureText(second).width > 725) {
			fontSize--;
			ctx.font = `${fontSize}px Noto`;
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
