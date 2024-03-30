const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class MarioBrosViewsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mario-bros-views',
			aliases: ['mario-views', 'luigi-views', 'mario-luigi-views', 'mario-says', 'luigi-says'],
			group: 'edit-meme',
			memberName: 'mario-bros-views',
			description: 'Sends a "Mario Bros. Views" meme with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Nintendo',
					url: 'https://www.nintendo.com/',
					reason: 'Original "Super Mario Bros." Game',
					reasonURL: 'https://mario.nintendo.com/'
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
					key: 'thing',
					type: 'string',
					max: 20
				},
				{
					key: 'mario',
					type: 'string',
					max: 280
				},
				{
					key: 'luigi',
					type: 'string',
					max: 280
				}
			]
		});
	}

	async run(msg, { thing, mario, luigi }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'mario-bros-views.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textBaseline = 'top';
		ctx.textAlign = 'center';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(47);
		ctx.fillText(thing, 420, 108, 180);
		ctx.fillStyle = 'white';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(36);
		let fontSize = 36;
		while (ctx.measureText(mario).width > 800) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const marioLines = await wrapText(ctx, mario, 200);
		const marioTopMost = 450 - (((fontSize * marioLines.length) / 2) + ((20 * (marioLines.length - 1)) / 2));
		for (let i = 0; i < marioLines.length; i++) {
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 5;
			const height = marioTopMost + ((fontSize + 20) * i);
			ctx.strokeText(marioLines[i], 205, height);
			ctx.fillText(marioLines[i], 205, height);
		}
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(36);
		fontSize = 36;
		while (ctx.measureText(luigi).width > 800) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const luigiLines = await wrapText(ctx, luigi, 200);
		const luigiTopMost = 450 - (((fontSize * luigiLines.length) / 2) + ((20 * (luigiLines.length - 1)) / 2));
		for (let i = 0; i < luigiLines.length; i++) {
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 5;
			const height = luigiTopMost + ((fontSize + 20) * i);
			ctx.strokeText(luigiLines[i], 450, height);
			ctx.fillText(luigiLines[i], 450, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'mario-bros-views.png' }] });
	}
};
