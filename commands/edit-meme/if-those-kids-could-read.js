const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class IfThoseKidsCouldReadCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'if-those-kids-could-read',
			aliases: ['if-those-kids-could', 'itkcr', 'itkc'],
			group: 'edit-meme',
			memberName: 'if-those-kids-could-read',
			description: 'Sends a "If those kids could read, they\'d be very upset" meme with the text of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: '20th Century Fox',
					url: 'https://www.foxmovies.com/',
					reason: 'Image, Original "King of the Hill" Show'
				},
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				},
				{
					name: 'Overtime2005',
					url: 'https://github.com/Overtime2005',
					reason: 'Concept'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What should the text of Bobby\'s poster be?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'if-those-kids-could-read.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = '40px Noto';
		let fontSize = 40;
		while (ctx.measureText(text).width > 560) {
			fontSize--;
			ctx.font = `${fontSize}px Noto`;
		}
		const lines = await wrapText(ctx, text, 160);
		const topMost = 140 - (((fontSize * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			const height = topMost + ((fontSize + 20) * i);
			ctx.fillText(lines[i], 300, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'if-those-kids-could-read.png' }] });
	}
};
