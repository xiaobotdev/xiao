const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { wrapText } = require('../../util/Canvas');

module.exports = class SubtitleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'subtitle',
			aliases: ['closed-caption', 'closed-captions', 'cc', 'st'],
			group: 'edit-image',
			memberName: 'subtitle',
			description: 'Adds subtitles to an image.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What should the subtitles say?',
					type: 'string',
					max: 200
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

	async run(msg, { text, image }) {
		try {
			const { body } = await request.get(image);
			const base = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			const fontSize = Math.round(base.height / 15);
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
			ctx.fillStyle = 'yellow';
			ctx.textAlign = 'center';
			const lines = await wrapText(ctx, text, base.width - 10);
			if (!lines) return msg.reply('There\'s not enough width to subtitle this image.');
			ctx.textBaseline = 'bottom';
			const initial = base.height - ((lines.length - 1) * fontSize) - (fontSize / 2) - ((lines.length - 1) * 10);
			for (let i = 0; i < lines.length; i++) {
				const textHeight = initial + (i * fontSize) + (i * 10);
				ctx.strokeStyle = 'black';
				const rounded = Math.round(base.height / 100);
				ctx.lineWidth = rounded < 1 ? 1 : rounded;
				ctx.strokeText(lines[i], base.width / 2, textHeight);
				ctx.fillStyle = 'yellow';
				ctx.fillText(lines[i], base.width / 2, textHeight);
			}
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'subtitle.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
