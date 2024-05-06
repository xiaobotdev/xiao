const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImage, drawImageWithTint } = require('../../util/Canvas');

module.exports = class CommunistCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'communist',
			aliases: ['commie', 'communism'],
			group: 'edit-image',
			memberName: 'communist',
			description: 'Draws the Communist flag over an image or a user\'s avatar.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'PNGFuel',
					url: 'https://www.pngfuel.com/',
					reason: 'Image',
					reasonURL: 'https://www.pngfuel.com/free-png/osnol'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'communist.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		drawImageWithTint(ctx, data, 'red', 0, 0, data.width, data.height);
		const { x, y, width, height } = centerImage(base, data);
		ctx.globalAlpha = 0.5;
		ctx.drawImage(base, x + (width / 20), y + (height / 20), width * 0.9, height * 0.9);
		ctx.globalAlpha = 1;
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'communist.png' }] });
	}
};
