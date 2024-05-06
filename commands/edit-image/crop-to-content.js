const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const { cropToContent } = require('../../util/Canvas');

module.exports = class CropToContentCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'crop-to-content',
			group: 'edit-image',
			memberName: 'crop-to-content',
			description: 'Crops an image to its content.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			args: [
				{
					key: 'image',
					type: 'image'
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
		cropToContent(ctx, canvas, data.width, data.height);
		if (canvas.width === data.width && canvas.height === data.height) {
			return msg.say('Looks like this image is already cropped to its content.');
		}
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'crop-to-content.png' }] });
	}
};
