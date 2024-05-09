const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class SoraSelfieCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sora-selfie',
			aliases: ['sora', 'sora-camera', 'sora-cam'],
			group: 'edit-meme',
			memberName: 'sora-selfie',
			description: 'Draws an image or a user\'s avatar behind Sora taking a selfie.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Square Enix',
					url: 'https://square-enix-games.com/',
					reason: 'Original "Kingdom Hearts" Game',
					reasonURL: 'https://www.kingdomhearts.com/home/us/'
				},
				{
					name: '@Candasaurus',
					url: 'https://twitter.com/Candasaurus',
					reason: 'Image',
					reasonURL: 'https://twitter.com/Candasaurus/status/1041946636656599045'
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'sora-selfie.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, base.width, base.height);
		const ratio = data.width / data.height;
		const width = Math.round(base.height * ratio);
		ctx.drawImage(data, (base.width / 2) - (width / 2), 0, width, base.height);
		ctx.drawImage(base, 0, 0);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'sora-selfie.png' }] });
	}
};
