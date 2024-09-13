const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class LookAtThisPhotographCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'look-at-this-photograph',
			aliases: ['nickelback', 'look-at-this-photo', 'photograph'],
			group: 'edit-meme',
			description: 'Draws an image or a user\'s avatar over Nickelback\'s photograph.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Nickelback',
					url: 'https://www.nickelback.com/',
					reason: 'Image, Original "Photograph" Music Video',
					reasonURL: 'https://www.youtube.com/watch?v=BB0DU4DoPP4'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 256,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 256, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'look-at-this-photograph.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.rotate(-13.5 * (Math.PI / 180));
		ctx.drawImage(data, 280, 218, 175, 125);
		ctx.rotate(13.5 * (Math.PI / 180));
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'look-at-this-photograph.png' }] });
	}
};
