const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');
const { wrapText, fillTextWithBreaks } = require('../../util/Canvas');

module.exports = class SonicSaysCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sonic-says',
			aliases: ['sonic-say', 'sonic'],
			group: 'edit-meme',
			memberName: 'sonic-says',
			description: 'Sends a "Sonic Says" meme with the quote of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				},
				{
					name: 'SEGA',
					url: 'https://www.sega.com/',
					reason: 'Image, Original "Sonic the Hedgehog" Game',
					reasonURL: 'https://www.sonicthehedgehog.com/'
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'sonic-says.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.textBaseline = 'top';
		ctx.drawImage(base, 0, 0);
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(24);
		let fontSize = 24;
		while (ctx.measureText(text).width > 648) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const lines = wrapText(ctx, text, 185);
		ctx.fillStyle = 'white';
		fillTextWithBreaks(ctx, lines.join('\n'), 92, 67, 185);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'sonic-says.png' }] });
	}
};
