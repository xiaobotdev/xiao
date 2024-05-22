const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class WorthlessCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'worthless',
			aliases: ['this-is-worthless'],
			group: 'edit-meme',
			description: 'Draws an image or a user\'s avatar over Gravity Falls\' "This is worthless." meme.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Disney',
					url: 'https://www.disney.com/',
					reason: 'Original "Gravity Falls" Show',
					reasonURL: 'https://disneynow.com/shows/gravity-falls'
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'worthless.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.rotate(6 * (Math.PI / 180));
		const center1 = centerImagePart(data, 400, 400, 496, 183);
		ctx.drawImage(data, center1.x, center1.y, center1.width, center1.height);
		ctx.rotate(-6 * (Math.PI / 180));
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate(160 * (Math.PI / 180));
		ctx.translate(-(canvas.width / 2), -(canvas.height / 2));
		const center2 = centerImagePart(data, 75, 75, 625, 55);
		ctx.drawImage(data, center2.x, center2.y, center2.width, center2.height);
		ctx.rotate(-160 * (Math.PI / 180));
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'worthless.png' }] });
	}
};
