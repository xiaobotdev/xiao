const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'megaman_zero_dialog.ttf'), { family: 'MM Zero' });

module.exports = class ZeroDialogueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'zero-dialogue',
			aliases: [
				'megaman-zero-dialogue',
				'mm-zero-dialogue',
				'zero-dialog',
				'megaman-zero-dialog',
				'mm-zero-dialog',
				'zero-quote',
				'megaman-zero-quote',
				'mm-zero-quote',
				'zero',
				'megaman-zero',
				'mm-zero'
			],
			group: 'edit-image',
			memberName: 'zero-dialogue',
			description: 'Sends a text box from Megaman Zero with the quote of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Capcom',
					url: 'http://www.capcom.com/us/',
					reason: 'Image, Original "Megaman Zero" Game',
					reasonURL: 'http://megaman.capcom.com/'
				},
				{
					name: 'Megadreamer',
					url: 'https://www.deviantart.com/megadreamer',
					reason: 'Megaman Zero Dialogue Font',
					reasonURL: 'https://www.deviantart.com/megadreamer/art/Megaman-Zero-dialog-font-513708688'
				}
			],
			args: [
				{
					key: 'quote',
					prompt: 'What should Zero say?',
					type: 'string',
					max: 50
				}
			]
		});
	}

	async run(msg, { quote }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'zero-dialogue.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = '42px MM Zero';
		ctx.fillStyle = 'white';
		ctx.textBaseline = 'top';
		let text = await wrapText(ctx, quote, 425);
		text = text.length > 2 ? `${text.slice(2).join('\n')}...` : text.join('\n');
		ctx.fillText(text, 8, 8);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'zero-dialogue.png' }] });
	}
};
