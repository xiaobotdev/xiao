const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'lmroman10-italic.otf'), {
	family: 'Latin Modern Roman',
	style: 'italic'
});

module.exports = class GandhiQuoteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gandhi-quote',
			aliases: ['gandhi', 'mahatma-gandhi', 'mahatma-gandhi-quote'],
			group: 'edit-meme',
			memberName: 'gandhi-quote',
			description: 'Makes Mahatma Gandhi say the quote you want.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'GUST e-foundry',
					url: 'https://www.fontsquirrel.com/fonts/list/foundry/gust-e-foundry',
					reason: 'Latin Modern Roman Font',
					reasonURL: 'https://www.fontsquirrel.com/fonts/Latin-Modern-Roman'
				},
				{
					name: 'Overtime2005',
					url: 'https://github.com/Overtime2005',
					reason: 'Concept'
				}
			],
			args: [
				{
					key: 'quote',
					prompt: 'What quote should Gandhi say?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'gandhi-quote.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = 'italic 50px Latin Modern Roman';
		ctx.fillStyle = 'white';
		let fontSize = 50;
		while (ctx.measureText(text).width > 1485) {
			fontSize--;
			ctx.font = `${fontSize}px Noto`;
		}
		const lines = await wrapText(ctx, text, 270);
		const topMost = 180 - (((fontSize * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			const height = topMost + ((fontSize + 20) * i);
			ctx.fillText(lines[i], 395, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'gandhi-quote.png' }] });
	}
};
