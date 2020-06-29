const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class DrakepostingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'drakeposting',
			aliases: ['drake'],
			group: 'edit-meme',
			memberName: 'drakeposting',
			description: 'Sends a "Drakeposting" meme with the text of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Drake',
					url: 'https://drakeofficial.com/',
					reason: 'Original "Hotline Bling" Music Video',
					reasonURL: 'https://youtu.be/uxpDa-c-4Mc'
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
					key: 'nah',
					prompt: 'What text should be the "nah"?',
					type: 'string',
					max: 500
				},
				{
					key: 'yeah',
					prompt: 'What text should be the "yeah"?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { nah, yeah }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'drakeposting.png'));
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			ctx.font = '50px Noto';
			let fontSize = 50;
			while (ctx.measureText(nah).width > 3003) {
				fontSize--;
				ctx.font = `${fontSize}px Noto`;
			}
			const nahLines = await wrapText(ctx, nah, 462);
			const nahTopMost = 256 - (((fontSize * nahLines.length) / 2) + ((10 * (nahLines.length - 1)) / 2));
			for (let i = 0; i < nahLines.length; i++) {
				const height = nahTopMost + ((fontSize + 10) * i);
				ctx.fillText(nahLines[i], 768, height);
			}
			ctx.font = '50px Noto';
			fontSize = 50;
			while (ctx.measureText(yea).width > 3003) {
				fontSize--;
				ctx.font = `${fontSize}px Noto`;
			}
			const yeahLines = await wrapText(ctx, yeah, 462);
			const yeahTopMost = 768 - (((fontSize * yeahLines.length) / 2) + ((10 * (yeahLines.length - 1)) / 2));
			for (let i = 0; i < yeahLines.length; i++) {
				const height = yeahTopMost + ((fontSize + 10) * i);
				ctx.fillText(yeahLines[i], 768, height);
			}
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'drakeposting.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
