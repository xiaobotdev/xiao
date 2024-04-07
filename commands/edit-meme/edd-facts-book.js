const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class EddFactsBookCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'edd-facts-book',
			aliases: ['edd-fact-book', 'double-d-facts-book', 'double-d-fact-book', 'edd-facts', 'edd-fact'],
			group: 'edit-meme',
			memberName: 'edd-facts-book',
			description: 'Sends a "Double D\'s Facts Book" meme with the fact of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				},
				{
					name: 'Cartoon Network',
					url: 'https://www.cartoonnetworkme.com/',
					reason: 'Image, Original "Ed, Edd n Eddy" TV Series',
					reasonURL: 'https://www.cartoonnetworkme.com/show/ed-edd-n-eddy'
				}
			],
			args: [
				{
					key: 'fact',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { fact }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'edd-facts-book.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.textBaseline = 'top';
		ctx.drawImage(base, 0, 0);
		ctx.rotate(15 * (Math.PI / 180));
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(30);
		let fontSize = 30;
		while (ctx.measureText(fact).width > 458) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const lines = await wrapText(ctx, fact, 183);
		ctx.fillText(lines.join('\n'), 119, 306, 183);
		ctx.rotate(-15 * (Math.PI / 180));
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'edd-facts-book.png' }] });
	}
};
