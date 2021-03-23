const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class ChineseRestaurantCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'chinese-restaurant',
			aliases: ['chinese-restaurant-sign', 'chinese-food-sign', 'chinese-sign'],
			group: 'edit-image-text',
			memberName: 'chinese-restaurant',
			description: 'Sends a Chinese restaurant sign with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'ATOM.SMASHER.ORG',
					url: 'http://atom.smasher.org/',
					reason: 'Image',
					reasonURL: 'http://atom.smasher.org/chinese/'
				},
				{
					name: 'Fontsgeek',
					url: 'http://fontsgeek.com/',
					reason: 'Futura Condensed Font',
					reasonURL: 'http://fontsgeek.com/fonts/Futura-Condensed-Bold'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What should the text of the sign be?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'chinese-restaurant.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.fillStyle = '#1f1f1f';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('Futura Condensed Bold.otf').toCanvasString(28);
		const lines = await wrapText(ctx, text.toUpperCase(), 340);
		if (lines.length === 1) {
			ctx.fillText(lines[0], base.width / 2, 288);
		} else if (lines.length === 2) {
			ctx.fillText(lines[0], base.width / 2, 288);
			ctx.fillText(lines[1], base.width / 2, 315);
		} else if (lines.length === 3) {
			ctx.fillText(lines[0], base.width / 2, 261);
			ctx.fillText(lines[1], base.width / 2, 288);
			ctx.fillText(lines[2], base.width / 2, 315);
		} else {
			ctx.fillText(lines[0], base.width / 2, 261);
			ctx.fillText(lines[1], base.width / 2, 288);
			ctx.fillText(lines[2], base.width / 2, 315);
			ctx.fillText(lines[3], base.width / 2, 342);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'chinese-restaurant.png' }] });
	}
};
