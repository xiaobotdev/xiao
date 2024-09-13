const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const { desaturate, contrast } = require('../../util/Canvas');

module.exports = class DeepFryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'deep-fry',
			group: 'edit-meme',
			description: 'Draws an image or a user\'s avatar but deep-fried.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
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
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		desaturate(ctx, -20, 0, 0, data.width, data.height);
		contrast(ctx, 0, 0, data.width, data.height);
		const attachment = canvas.toBuffer('image/jpeg', { quality: 0.2 });
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'deep-fry.jpeg' }] });
	}
};
