const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class SonicSaysCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sonic-says',
			aliases: ['sonic-say', 'sonic'],
			group: 'edit-meme',
			memberName: 'sonic-says',
			description: 'Sends a "Sonic Says" meme with the quote of your choice.',
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
					name: 'SEGA',
					url: 'https://www.sega.com/',
					reason: 'Image, Original "Sonic the Hedgehog" Game',
					reasonURL: 'https://www.sonicthehedgehog.com/'
				},
				{
					name: '0vertime-dev',
					url: 'https://github.com/0vertime-dev',
					reason: 'Concept'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What should Sonic say?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'sonic-says.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.textBaseline = 'top';
		ctx.drawImage(base, 0, 0);
		ctx.font = '24px Noto';
		let fontSize = 24;
		while (ctx.measureText(text).width > 648) {
			fontSize--;
			ctx.font = `${fontSize}px Noto`;
		}
		const lines = await wrapText(ctx, text, 185);
		ctx.fillStyle = 'white';
		ctx.fillText(lines.join('\n'), 92, 67, 185);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'sonic-says.png' }] });
	}
};
