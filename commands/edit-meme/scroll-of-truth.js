const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class ScrollOfTruthCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'scroll-of-truth',
			aliases: ['truth', 'scroll', 'truth-scroll', 'scroll-truth'],
			group: 'edit-meme',
			description: 'Sends a "Scroll of Truth" meme with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Robotatertot',
					url: 'https://robotatertot.tumblr.com/',
					reason: 'Image',
					reasonURL: 'https://robotatertot.tumblr.com/post/156736308530/truth'
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'scroll-of-truth.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(60);
		let fontSize = 60;
		while (ctx.measureText(text).width > 542) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const lines = wrapText(ctx, text, 217);
		const topMost = 850 - (((fontSize * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			const height = topMost + ((fontSize + 20) * i);
			ctx.fillText(lines[i], 350, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'scroll-of-truth.png' }] });
	}
};
