const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class LookWhatKarenHaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'look-what-karen-have',
			aliases: ['look-at-what-karen-has', 'look-what-karen-has', 'karen', 'ayaya'],
			group: 'edit-meme',
			description: 'Draws an image or a user\'s avatar over Karen\'s piece of paper.',
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
					reasonURL: 'https://knowyourmeme.com/photos/1047091-kin-iro-mosaic-kinmoza'
				},
				{
					name: 'KINMOZA!',
					url: 'http://www.kinmosa.com/',
					reason: 'Original Anime'
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'look-what-karen-have.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, base.width, base.height);
		ctx.rotate(-6.5 * (Math.PI / 180));
		const { x, y, width, height } = centerImagePart(data, 512, 512, 514, 50);
		ctx.drawImage(data, x, y, width, height);
		ctx.rotate(6.5 * (Math.PI / 180));
		ctx.drawImage(base, 0, 0);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'look-what-karen-have.png' }] });
	}
};
