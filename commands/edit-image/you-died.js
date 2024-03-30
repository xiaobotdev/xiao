const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImage, greyscale, drawImageWithTint } = require('../../util/Canvas');

module.exports = class YouDiedCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'you-died',
			aliases: ['died', 'dead'],
			group: 'edit-image',
			memberName: 'you-died',
			description: 'Sends a "You Died" screen over an image or a user\'s avatar.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'FromSoftware',
					url: 'https://www.fromsoftware.jp/ww/',
					reason: 'Image, Original "Dark Souls" Game'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'you-died.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		drawImageWithTint(ctx, data, 'black', 0, 0, data.width, data.height);
		greyscale(ctx, 0, 0, data.width, data.height);
		const { x, y, width, height } = centerImage(base, data);
		ctx.drawImage(base, x, y, width, height);
		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
		return msg.say({ files: [{ attachment, name: 'you-died.png' }] });
	}
};
