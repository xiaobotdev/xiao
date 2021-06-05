const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { wrapText, greyscale, drawImageWithTint } = require('../../util/Canvas');

module.exports = class NikeAdCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nike-ad',
			aliases: ['believe-in-something', 'believe-in'],
			group: 'edit-meme',
			memberName: 'nike-ad',
			description: 'Sends a "Believe in Something" Nike Ad meme with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Nike',
					url: 'https://www.nike.com/',
					reason: 'Logo, Concept'
				},
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				}
			],
			args: [
				{
					key: 'something',
					prompt: 'What should the something to believe in be?',
					type: 'string',
					max: 50
				},
				{
					key: 'sacrifice',
					prompt: 'What should believing result in (e.g. sacrificing everything)?',
					type: 'string',
					max: 50
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 2048 })
				}
			]
		});
	}

	async run(msg, { image, something, sacrifice }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'nike-ad.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			drawImageWithTint(ctx, data, 'black', 0, 0, data.width, data.height);
			greyscale(ctx, 0, 0, data.width, data.height);
			const ratio = base.width / base.height;
			const width = data.width / 3;
			const height = Math.round(width / ratio);
			ctx.drawImage(base, (data.width / 2) - (width / 2), data.height - height, width, height);
			const fontSize = Math.round(data.height / 25);
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			const lines = await wrapText(ctx, `Believe in ${something}. Even if it means ${sacrifice}.`, data.width - 20);
			if (!lines) return msg.reply('There\'s not enough width to make a Nike ad with this image.');
			const initial = data.height / 2;
			for (let i = 0; i < lines.length; i++) {
				const textHeight = initial + (i * fontSize) + (i * 10);
				ctx.fillText(lines[i], data.width / 2, textHeight);
			}
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'nike-ad.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
