const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class DrakepostingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'drakeposting',
			aliases: ['drake'],
			group: 'edit-meme',
			memberName: 'drakeposting',
			description: 'Sends a "Drakeposting" meme with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Drake',
					url: 'https://drakeofficial.com/',
					reason: 'Original "Hotline Bling" Music Video',
					reasonURL: 'https://youtu.be/uxpDa-c-4Mc'
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
					key: 'nah',
					type: 'string',
					max: 500
				},
				{
					key: 'yeah',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { nah, yeah }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'drakeposting.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(50);
		let fontSize = 50;
		while (ctx.measureText(nah).width > 3003) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const nahLines = wrapText(ctx, nah, 462);
		const nahTopMost = 256 - (((fontSize * nahLines.length) / 2) + ((10 * (nahLines.length - 1)) / 2));
		for (let i = 0; i < nahLines.length; i++) {
			const height = nahTopMost + ((fontSize + 10) * i);
			ctx.fillText(nahLines[i], 768, height);
		}
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(50);
		fontSize = 50;
		while (ctx.measureText(yeah).width > 3003) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const yeahLines = wrapText(ctx, yeah, 462);
		const yeahTopMost = 768 - (((fontSize * yeahLines.length) / 2) + ((10 * (yeahLines.length - 1)) / 2));
		for (let i = 0; i < yeahLines.length; i++) {
			const height = yeahTopMost + ((fontSize + 10) * i);
			ctx.fillText(yeahLines[i], 768, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'drakeposting.png' }] });
	}
};
