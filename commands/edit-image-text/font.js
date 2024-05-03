const Command = require('../../framework/Command');
const { createCanvas } = require('canvas');
const { wrapText } = require('../../util/Canvas');

module.exports = class FontCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'font',
			aliases: ['font-test', 'text-image', 'txt-img', 'text-img', 'txt-image'],
			group: 'edit-image-text',
			memberName: 'font',
			description: 'Types text in a specific font.',
			throttling: {
				usages: 2,
				duration: 10
			},
			args: [
				{
					key: 'font',
					type: 'font'
				},
				{
					key: 'text',
					type: 'string'
				}
			]
		});
	}

	run(msg, { font, text }) {
		const image = this.generateImage(font, text);
		return msg.say({ files: [{ attachment: image, name: `${font.filenameNoExt}.png` }] });
	}

	generateImage(font, text) {
		const canvasPre = createCanvas(1, 1);
		const ctxPre = canvasPre.getContext('2d');
		ctxPre.font = this.client.fonts.get(font.filename).toCanvasString(50);
		const len = ctxPre.measureText(text);
		const lines = wrapText(ctxPre, text, 950);
		const height = len.actualBoundingBoxAscent + len.actualBoundingBoxDescent;
		const canvas = createCanvas(Math.min(len.width + 50, 1000), 50 + height);
		const ctx = canvas.getContext('2d');
		ctx.font = this.client.fonts.get(font.filename).toCanvasString(50);
		ctx.textBaseline = 'top';
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'black';
		ctx.fillText(lines.join('\n'), 25, 25);
		return canvas.toBuffer();
	}
};
