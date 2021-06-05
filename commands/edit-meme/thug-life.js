const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { greyscale } = require('../../util/Canvas');

module.exports = class ThugLifeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'thug-life',
			aliases: ['thug'],
			group: 'edit-meme',
			memberName: 'thug-life',
			description: 'Draws "Thug Life" over an image or a user\'s avatar.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'pngimg.com',
					url: 'https://pngimg.com/',
					reason: 'Image',
					reasonURL: 'http://pngimg.com/download/58231'
				}
			],
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 2048 })
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'thug-life.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(data, 0, 0);
			greyscale(ctx, 0, 0, data.width, data.height);
			const ratio = base.width / base.height;
			const width = data.width / 2;
			const height = Math.round(width / ratio);
			ctx.drawImage(base, (data.width / 2) - (width / 2), data.height - height, width, height);
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'thug-life.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
