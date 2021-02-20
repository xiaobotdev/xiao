const Command = require('../../structures/Command');
const { createCanvas } = require('canvas');
const { wrapText } = require('../../util/Canvas');

module.exports = class FontCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'font',
			aliases: ['font-test', 'text-image', 'txt-img', 'text-img', 'txt-image'],
			group: 'edit-image',
			memberName: 'font',
			description: 'Types text in a specific font.',
			throttling: {
				usages: 1,
				duration: 10
			},
			args: [
				{
					key: 'font',
					prompt: 'What font do you want to use? Only fonts used in other commands are available.',
					type: 'font'
				},
				{
					key: 'text',
					prompt: 'What text do you want to type?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { font, text }) {
		const image = await this.generateImage(font, text);
		return msg.say({ files: [{ attachment: image, name: `${font.filenameNoExt}.png` }] });
	}

	async generateImage(font, text) {
		const canvasPre = createCanvas(1, 1);
		const ctxPre = canvasPre.getContext('2d');
		ctxPre.font = this.client.fonts.get(font.filename).toCanvasString(50);
		const len = ctxPre.measureText(text);
		const lines = await wrapText(ctxPre, text, 950);
		const canvas = createCanvas(Math.min(len.width + 50, 1000), 50 + (50 * lines.length) + (10 * lines.length));
		const ctx = canvas.getContext('2d');
		ctx.font = this.client.fonts.get(font.filename).toCanvasString(75);
		ctx.textBaseline = 'top';
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'black';
		ctx.fillText(lines.join('\n'), canvas.width / 2, 25);
		return canvas.toBuffer();
	}
};
