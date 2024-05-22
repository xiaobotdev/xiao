const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class BobRossCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bob-ross',
			aliases: ['ross'],
			group: 'edit-image',
			description: 'Draws an image or a user\'s avatar over Bob Ross\' canvas.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Know Your Meme',
					url: 'https://knowyourmeme.com/',
					reason: 'Image',
					reasonURL: 'https://knowyourmeme.com/photos/1160348'
				},
				{
					name: 'Bob Ross',
					url: 'https://www.bobross.com/',
					reason: 'Himself'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 512,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'bob-ross.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, base.width, base.height);
		const { x, y, width, height } = centerImagePart(data, 440, 440, 15, 20);
		ctx.drawImage(data, x, y, width, height);
		ctx.drawImage(base, 0, 0);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'bob-ross.png' }] });
	}
};
