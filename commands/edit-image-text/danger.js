const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class DangerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'danger',
			aliases: ['danger-sign'],
			group: 'edit-image-text',
			description: 'Creates a danger sign with the text of your choice.',
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
					name: 'Wikimedia Commons',
					url: 'https://commons.wikimedia.org/wiki/Main_Page',
					reason: 'Image',
					reasonURL: 'https://commons.wikimedia.org/wiki/File:Danger_blank.svg'
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'danger.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(60);
		let fontSize = 60;
		while (ctx.measureText(text).width > 2520) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Bold.ttf').toCanvasString(fontSize);
		}
		const lines = wrapText(ctx, text.toUpperCase(), 840);
		const topMost = 510 - (((fontSize * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			const height = topMost + ((fontSize + 20) * i);
			ctx.fillText(lines[i], base.width / 2, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'danger.png' }] });
	}
};
