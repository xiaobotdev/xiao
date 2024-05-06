const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const { fishEye } = require('../../util/Canvas');

module.exports = class FishEyeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fish-eye',
			aliases: ['bulge'],
			group: 'edit-image',
			memberName: 'fish-eye',
			description: 'Draws an image or a user\'s avatar but with a fish-eye lens.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Hackyon',
					url: 'http://www.hackyon.com/playground/fisheye/',
					reason: 'Fish-Eye Code'
				}
			],
			args: [
				{
					key: 'level',
					type: 'integer',
					min: 1,
					max: 100
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { level, image }) {
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		fishEye(ctx, level, 0, 0, data.width, data.height);
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'fish-eye.png' }] });
	}
};
