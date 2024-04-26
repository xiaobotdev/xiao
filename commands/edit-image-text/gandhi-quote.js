const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class GandhiQuoteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gandhi-quote',
			aliases: ['gandhi', 'mahatma-gandhi', 'mahatma-gandhi-quote'],
			group: 'edit-image-text',
			memberName: 'gandhi-quote',
			description: 'Makes Mahatma Gandhi say the quote you want.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'GUST e-foundry',
					url: 'https://www.fontsquirrel.com/fonts/list/foundry/gust-e-foundry',
					reason: 'Latin Modern Roman Font',
					reasonURL: 'https://www.fontsquirrel.com/fonts/Latin-Modern-Roman'
				}
			],
			args: [
				{
					key: 'quote',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { quote }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'gandhi-quote.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('lmroman10-italic.otf').toCanvasString(50);
		ctx.fillStyle = 'white';
		let fontSize = 50;
		while (ctx.measureText(quote).width > 945) {
			fontSize--;
			ctx.font = this.client.fonts.get('lmroman10-italic.otf').toCanvasString(fontSize);
		}
		const lines = wrapText(ctx, quote, 270);
		const topMost = 180 - (((fontSize * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			const height = topMost + ((fontSize + 20) * i);
			ctx.fillText(lines[i], 395, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'gandhi-quote.png' }] });
	}
};
