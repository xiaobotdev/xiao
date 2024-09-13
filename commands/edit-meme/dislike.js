const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class DislikeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dislike',
			aliases: ['disliked', 'everyone-disliked-that', 'disliked-that', 'everyone-disliked'],
			group: 'edit-meme',
			description: 'Sends an "Everyone Disliked That" meme with the image of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Bethesda',
					url: 'https://bethesda.net/en/dashboard',
					reason: 'Image, Original "Fallout" Game',
					reasonURL: 'https://fallout.bethesda.net/en/'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 1024,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 1024, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { image }) {
		const { body } = await request.get(image);
		const base = await loadImage(body);
		const plate = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'dislike.png'));
		const scaleH = plate.width / base.width;
		const height = Math.round(base.height * scaleH);
		const canvas = createCanvas(plate.width, plate.height + height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0, plate.width, height);
		ctx.drawImage(plate, 0, height);
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'dislike.png' }] });
	}
};
