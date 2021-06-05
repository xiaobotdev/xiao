const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class ChangeMyMindCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'change-my-mind',
			aliases: ['change-mind', 'mind-change', 'cmv', 'cmm'],
			group: 'edit-meme',
			memberName: 'change-my-mind',
			description: 'Sends a "Change My Mind" meme with the text of your choice.',
			throttling: {
				usages: 2,
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
		ctx.rotate(-24 * (Math.PI / 180));
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(35);
		let fontSize = 35;
		while (ctx.measureText(text).width > 843) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const lines = await wrapText(ctx, text, 337);
		ctx.fillText(lines.join('\n'), 142, 430, 337);
		ctx.rotate(24 * (Math.PI / 180));
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'change-my-mind.png' }] });
	}
};
