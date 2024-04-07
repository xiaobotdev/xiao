const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { wrapText } = require('../../util/Canvas');

module.exports = class MemeGenCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'meme-gen',
			aliases: ['meme-generator', 'gen-meme', 'mg', 'mgc'],
			group: 'edit-meme',
			memberName: 'meme-gen',
			description: 'Sends a meme with the text and background of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'ShareFonts.net',
					url: 'https://www.wfonts.com/',
					reason: 'Impact Font',
					reasonURL: 'https://www.wfonts.com/font/impact'
				}
			],
			args: [
				{
					key: 'top',
					type: 'string',
					max: 50,
					parse: top => top.toUpperCase()
				},
				{
					key: 'bottom',
					type: 'string',
					max: 50,
					parse: bottom => bottom.toUpperCase()
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 2048 })
				}
			]
		});
	}

	async run(msg, { top, bottom, image }) {
		const { body } = await request.get(image);
		const base = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		const fontSize = Math.round(base.height / 10);
		ctx.font = this.client.fonts.get('Impact.ttf').toCanvasString(fontSize);
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		const topLines = await wrapText(ctx, top, base.width - 10);
		if (!topLines) return msg.reply('There\'s not enough width to make a meme with this image.');
		for (let i = 0; i < topLines.length; i++) {
			const textHeight = (i * fontSize) + (i * 10);
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 5;
			ctx.strokeText(topLines[i], base.width / 2, textHeight);
			ctx.fillStyle = 'white';
			ctx.fillText(topLines[i], base.width / 2, textHeight);
		}
		const bottomLines = await wrapText(ctx, bottom, base.width - 10);
		if (!bottomLines) return msg.reply('There\'s not enough width to make a meme with this image.');
		ctx.textBaseline = 'bottom';
		const initial = base.height - ((bottomLines.length - 1) * fontSize) - ((bottomLines.length - 1) * 10);
		for (let i = 0; i < bottomLines.length; i++) {
			const textHeight = initial + (i * fontSize) + (i * 10);
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 5;
			ctx.strokeText(bottomLines[i], base.width / 2, textHeight);
			ctx.fillStyle = 'white';
			ctx.fillText(bottomLines[i], base.width / 2, textHeight);
		}
		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
		return msg.say({ files: [{ attachment, name: 'meme-gen.png' }] });
	}
};
