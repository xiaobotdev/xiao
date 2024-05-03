const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class SosCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sos',
			aliases: ['esther-verkest', 'esther', 'help-sign'],
			group: 'edit-meme',
			memberName: 'sos',
			description: 'Sends a "Esther Verkest\'s Help Sign" comic with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Esther Verkest',
					url: 'https://www.facebook.com/Esther-Verkest-49667161749/',
					reason: 'Image'
				},
				{
					name: 'Walter E Stewart',
					url: 'https://www.1001freefonts.com/designer-walter-e-stewart-fontlisting.php',
					reason: 'Sun Dried Font',
					reasonURL: 'https://www.1001freefonts.com/sun-dried.font'
				}
			],
			args: [
				{
					key: 'message',
					type: 'string',
					max: 10
				}
			]
		});
	}

	async run(msg, { message }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'sos.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = this.client.fonts.get('SunDried.ttf').toCanvasString(90);
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.rotate(15 * (Math.PI / 180));
		let fontSize = 90;
		while (ctx.measureText(message).width > 140) {
			fontSize--;
			ctx.font = this.client.fonts.get('SunDried.ttf').toCanvasString(fontSize);
		}
		ctx.fillText(message.toUpperCase(), 362, 522);
		ctx.rotate(-15 * (Math.PI / 180));
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'sos.png' }] });
	}
};
