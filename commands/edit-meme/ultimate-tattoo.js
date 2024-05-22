const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class UltimateTattooCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ultimate-tattoo',
			aliases: ['the-ultimate-tattoo', 'tattoo'],
			group: 'edit-meme',
			description: 'Draws an image or a user\'s avatar as "The Ultimate Tattoo".',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Deathbulge',
					url: 'http://deathbulge.com/comics',
					reason: 'Image',
					reasonURL: 'http://deathbulge.com/comics/114'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 256,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 256 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'ultimate-tattoo.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.rotate(-10 * (Math.PI / 180));
		const { x, y, width, height } = centerImagePart(data, 300, 300, 84, 690);
		ctx.drawImage(data, x, y, width, height);
		ctx.rotate(10 * (Math.PI / 180));
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'ultimate-tattoo.png' }] });
	}
};
