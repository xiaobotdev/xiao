const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class ScrollOfTruthCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'scroll-of-truth',
			aliases: ['truth', 'scroll', 'truth-scroll', 'scroll-truth'],
			group: 'edit-meme',
			memberName: 'scroll-of-truth',
			description: 'Sends a "Scroll of Truth" meme with the text of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Robotatertot',
					url: 'https://robotatertot.tumblr.com/',
					reason: 'Image',
					reasonURL: 'https://robotatertot.tumblr.com/post/156736308530/truth'
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
					prompt: 'What do you want the scroll of truth to say?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'scroll-of-truth.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = '60px Noto';
		let fontSize = 60;
		while (ctx.measureText(text).width > 651) {
			fontSize -= 1;
			ctx.font = `${fontSize}px Noto`;
		}
		const lines = await wrapText(ctx, text, 217);
		const topMost = 850 - (((fontSize * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			const height = topMost + ((fontSize + 20) * i);
			ctx.fillText(lines[i], 350, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'scroll-of-truth.png' }] });
	}
};
