const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class GunCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gun',
			group: 'edit-image',
			description: 'Draws a gun over an image or a user\'s avatar.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Luxoflux',
					url: 'http://www.luxoflux.com/',
					reason: 'Image',
					reasonURL: 'https://knowyourmeme.com/memes/hand-pointing-a-gun'
				}
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'gun.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		const ratio = (data.height / 2) / base.height;
		const width = base.width * ratio;
		ctx.drawImage(base, data.width - width, data.height - (data.height / 2), width, data.height / 2);
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'gun.png' }] });
	}
};
