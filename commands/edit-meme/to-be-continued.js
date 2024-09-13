const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { drawImageWithTint } = require('../../util/Canvas');

module.exports = class ToBeContinuedCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'to-be-continued',
			aliases: ['tbc', 'つづく', 'tsudzuku', 'tsuzuku'],
			group: 'edit-meme',
			description: 'Draws an image with the "To Be Continued..." arrow.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'JoJo\'s Bizzare Adventure',
					url: 'http://www.araki-jojo.com/',
					reason: 'Original Anime'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 512,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'to-be-continued.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		drawImageWithTint(ctx, data, '#704214', 0, 0, data.width, data.height);
		const ratio = base.width / base.height;
		const width = canvas.width / 2;
		const height = Math.round(width / ratio);
		ctx.drawImage(base, 0, canvas.height - height, width, height);
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'to-be-continued.png' }] });
	}
};
