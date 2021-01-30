const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = class NeedsMoreJpegCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'needs-more-jpeg',
			aliases: ['jpeg', 'jpegify'],
			group: 'edit-image',
			memberName: 'needs-more-jpeg',
			description: 'Draws an image or a user\'s avatar as a low quality JPEG.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'quality',
					prompt: 'What quality should the resulting image use?',
					type: 'float',
					default: 0.5,
					min: 0.01,
					max: 10
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image, quality }) {
		try {
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(data, 0, 0);
			const attachment = canvas.toBuffer('image/jpeg', { quality: quality / 10 });
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'needs-more-jpeg.jpeg' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
