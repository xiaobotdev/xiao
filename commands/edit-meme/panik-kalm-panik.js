const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class PanikKalmPanikCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'panik-kalm-panik',
			aliases: ['panic-calm-panic', 'pkp', 'panik', 'kalm'],
			group: 'edit-meme',
			memberName: 'panik-kalm-panik',
			description: 'Sends a "Panik, Kalm, Panik" meme with the text of your choice.',
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
				}
			],
			args: [
				{
					key: 'panik',
					label: 'first panik',
					type: 'string',
					max: 500
				},
				{
					key: 'kalm',
					type: 'string',
					max: 500
				},
				{
					key: 'panik2',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { panik, kalm, panik2 }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'panik-kalm-panik.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(40);
		let fontSize = 40;
		while (ctx.measureText(panik).width > 1136) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const panikLines = wrapText(ctx, panik, 284);
		const panikTopMost = 130 - (((fontSize * panikLines.length) / 2) + ((10 * (panikLines.length - 1)) / 2));
		for (let i = 0; i < panikLines.length; i++) {
			const height = panikTopMost + ((fontSize + 10) * i);
			ctx.fillText(panikLines[i], 150, height);
		}
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(40);
		fontSize = 40;
		while (ctx.measureText(kalm).width > 1136) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const kalmLines = wrapText(ctx, kalm, 284);
		const kalmTopMost = 430 - (((fontSize * kalmLines.length) / 2) + ((10 * (kalmLines.length - 1)) / 2));
		for (let i = 0; i < kalmLines.length; i++) {
			const height = kalmTopMost + ((fontSize + 10) * i);
			ctx.fillText(kalmLines[i], 150, height);
		}
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(40);
		fontSize = 40;
		while (ctx.measureText(panik2).width > 1136) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const panik2Lines = wrapText(ctx, panik2, 284);
		const panik2TopMost = 730 - (((fontSize * panik2Lines.length) / 2) + ((10 * (panik2Lines.length - 1)) / 2));
		for (let i = 0; i < panik2Lines.length; i++) {
			const height = panik2TopMost + ((fontSize + 10) * i);
			ctx.fillText(panik2Lines[i], 150, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'panik-kalm-panik.png' }] });
	}
};
