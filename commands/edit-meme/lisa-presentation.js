const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class LisaPresentationCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lisa-presentation',
			aliases: ['lisa'],
			group: 'edit-meme',
			memberName: 'lisa-presentation',
			description: 'Sends a "Lisa Presentation" meme with the presentation of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: '20th Century Fox',
					url: 'https://www.foxmovies.com/',
					reason: 'Image, Original "The Simpsons" Show',
					reasonURL: 'http://www.simpsonsworld.com/'
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
					key: 'text',
					prompt: 'What should the text of the presentation be?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'lisa-presentation.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = '40px Noto';
		let fontSize = 40;
		while (ctx.measureText(text).width > 1320) {
			fontSize -= 1;
			ctx.font = `${fontSize}px Noto`;
		}
		const lines = await wrapText(ctx, text, 330);
		const topMost = 185 - (((fontSize * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			const height = topMost + ((fontSize + 20) * i);
			ctx.fillText(lines[i], base.width / 2, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'lisa-presentation.png' }] });
	}
};
