const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class MemeGenModernCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'meme-gen-modern',
			aliases: [
				'meme-generator-modern',
				'create-meme-modern',
				'meme-gen-m',
				'modern-meme-gen',
				'modern-meme-generator',
				'create-modern-meme',
				'm-meme-gen',
				'm-meme-generator',
				'create-m-meme'
			],
			group: 'edit-meme',
			memberName: 'meme-gen-modern',
			description: 'Sends a meme with the text and image of your choice.',
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
					prompt: 'What should the text of the meme be?',
					type: 'string'
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 1024 })
				}
			]
		});
	}

	async run(msg, { text, image }) {
		try {
			const { body } = await request.get(image);
			const base = await loadImage(body);
			const canvas = createCanvas(body.width, body.height);
			const ctx = canvas.getContext('2d');
			ctx.font = '23px Noto';
			ctx.fillStyle = 'black';
			ctx.textBaseline = 'top';
			const lines = await wrapText(ctx, text, base.width - 10);
			const linesLen = (23 * lines.length) + (23 * (text.split('\n').length - 1)) + (9 * lines.length);
			canvas.height += linesLen;
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, base.width, linesLen);
			ctx.fillStyle = 'black';
			ctx.fillText(lines.join('\n'), 5, 5);
			ctx.drawImage(base, 0, linesLen + 1);
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'modern-meme-gen.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
