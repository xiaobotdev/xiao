const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class TwoButtonsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'two-buttons',
			aliases: ['buttons', 'button'],
			group: 'edit-meme',
			memberName: 'two-buttons',
			description: 'Sends a "Two Buttons" meme with the buttons of your choice.',
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
				},
				{
					name: 'Jake Clark',
					url: 'https://jake-clark.tumblr.com/',
					reason: 'Image',
					reasonURL: 'https://twitter.com/jakeclarkdude/status/689141113584619524'
				}
			],
			args: [
				{
					key: 'first',
					prompt: 'What should the text of the first button be?',
					type: 'string',
					max: 50
				},
				{
					key: 'second',
					prompt: 'What should the text of the second button be?',
					type: 'string',
					max: 50
				}
			]
		});
	}

	async run(msg, { first, second }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'two-buttons.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.rotate(12 * (Math.PI / 180));
		ctx.font = '50px Noto';
		let fontSize = 50;
		while (ctx.measureText(first).width > 183) {
			fontSize -= 1;
			ctx.font = `${fontSize}px Noto`;
		}
		const firstLines = await wrapText(ctx, first, 183);
		ctx.fillText(firstLines.join('\n'), 126, 70);
		ctx.font = '50px Noto';
		fontSize = 50;
		while (ctx.measureText(second).width > 122) {
			fontSize -= 1;
			ctx.font = `${fontSize}px Noto`;
		}
		const secondLines = await wrapText(ctx, second, 122);
		ctx.fillText(secondLines.join('\n'), 355, 79);
		ctx.rotate(-12 * (Math.PI / 180));
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'two-buttons.png' }] });
	}
};
