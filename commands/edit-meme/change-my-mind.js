const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class ChangeMyMindCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'change-my-mind',
			aliases: ['change-mind', 'mind-change'],
			group: 'edit-meme',
			memberName: 'change-my-mind',
			description: 'Sends a "Change My Mind" meme with the text of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Steven Crowder',
					url: 'https://www.youtube.com/StevenCrowder',
					reason: 'Image',
					reasonURL: 'https://twitter.com/scrowder/status/964577508447449088'
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
					prompt: 'What should be on the poster?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'change-my-mind.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.textBaseline = 'top';
		ctx.drawImage(base, 0, 0);
		ctx.rotate(-6 * (Math.PI / 180));
		ctx.font = '28px Noto';
		let fontSize = 28;
		while (ctx.measureText(text).width > 309) {
			fontSize--;
			ctx.font = `${fontSize}px Noto`;
		}
		const lines = await wrapText(ctx, text, 206);
		ctx.fillText(lines.join('\n'), 184, 243, 206);
		ctx.rotate(6 * (Math.PI / 180));
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'change-my-mind.png' }] });
	}
};
