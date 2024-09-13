const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');
const frames = require('../../assets/json/frame');

module.exports = class FrameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'frame',
			aliases: ['picture-frame', 'photo-frame'],
			group: 'edit-image',
			description: 'Draws a frame around an image or a user\'s avatar.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'www.aljanh.net',
					url: 'http://www.aljanh.net/',
					reason: 'Classic Image',
					reasonURL: 'http://www.aljanh.net/frame-wallpapers/1508614706.html'
				}
			],
			args: [
				{
					key: 'frame',
					type: 'string',
					oneOf: Object.keys(frames),
					parse: frame => frames[frame.toLowerCase()]
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 512,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { frame, image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'frame', frame.file));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		let canvas;
		if (frame.stretch) {
			canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(data, 0, 0);
			ctx.drawImage(base, 0, 0, data.width, data.height);
		} else {
			canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = 'black';
			ctx.fillRect(frame.xStart, frame.yStart, frame.xSize, frame.ySize);
			const { x, y, width, height } = centerImagePart(data, frame.xSize, frame.ySize, frame.xStart, frame.yStart);
			ctx.drawImage(data, x, y, width, height);
			ctx.drawImage(base, 0, 0);
		}
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: `frame-${frame.file}` }] });
	}
};
