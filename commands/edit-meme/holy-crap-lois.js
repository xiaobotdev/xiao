const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class HolyCrapLoisCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'holy-crap-lois',
			aliases: ['holy-crap', 'peter-door', 'peter-at-the-door'],
			group: 'edit-meme',
			description: 'Draws an image or a user\'s avatar at the door to Peter Griffin\'s house.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: '20th Century Fox',
					url: 'https://www.foxmovies.com/',
					reason: 'Image, Original "Family Guy" Show'
				},
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'holy-crap-lois', `bg.png`));
		const door = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'holy-crap-lois', `door.png`));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		const { x, y, width, height } = centerImagePart(data, 424, 424, 0, 40);
		ctx.drawImage(data, x, y, width, height);
		ctx.drawImage(door, 0, 0);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'holy-crap-lois.png' }] });
	}
};
