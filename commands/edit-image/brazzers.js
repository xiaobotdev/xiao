const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class BrazzersCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'brazzers',
			group: 'edit-image',
			memberName: 'brazzers',
			description: 'Draws an image with the Brazzers logo in the corner.',
			nsfw: true,
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Brazzers',
					url: 'https://www.brazzers.com/',
					reason: 'Logo'
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'brazzers.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		const ratio = base.width / base.height;
		const width = data.width / 3;
		const height = Math.round(width / ratio);
		ctx.drawImage(base, 0, data.height - height, width, height);
		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
		return msg.say({ files: [{ attachment, name: 'brazzers.png' }] });
	}
};
