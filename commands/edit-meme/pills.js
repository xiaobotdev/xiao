const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class PillsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pills',
			aliases: ['hard-to-swallow-pills', 'hard-pills'],
			group: 'edit-meme',
			memberName: 'pills',
			description: 'Sends a "Hard to Swallow Pills" meme with the text of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Overtime2005',
					url: 'https://github.com/Overtime2005',
					reason: 'Concept'
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
					prompt: 'What do you want to be hard to swallow?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'pills.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = '32px Noto';
		let fontSize = 32;
		while (ctx.measureText(text).width > 1260) {
			fontSize--;
			ctx.font = `${fontSize}px Noto`;
		}
		const lines = await wrapText(ctx, text, 280);
		const topMost = 455 - (((fontSize * lines.length) / 2) + ((10 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			const height = topMost + ((fontSize + 10) * i);
			ctx.fillText(lines[i], 183, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'pills.png' }] });
	}
};
