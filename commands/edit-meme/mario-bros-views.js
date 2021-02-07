const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class MarioBrosViewsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mario-bros-views',
			aliases: ['mario-views', 'luigi-views', 'mario-luigi-views', 'mario-says', 'luigi-says'],
			group: 'edit-meme',
			memberName: 'mario-bros-views',
			description: 'Sends a "Mario Bros. Views" meme with the text of your choice.',
			throttling: {
				usages: 1,
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
				},
				{
					name: '0vertime-dev',
					url: 'https://github.com/0vertime-dev',
					reason: 'Concept'
				}
			],
			args: [
				{
					key: 'thing',
					prompt: 'What do you want the Mario Bros. to tell their views on?',
					type: 'string',
					max: 20
				},
				{
					key: 'mario',
					prompt: 'What should Mario\'s views be?',
					type: 'string',
					max: 280
				},
				{
					key: 'luigi',
					prompt: 'What should Luigi\'s views be?',
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
		ctx.font = '47px Noto';
		ctx.fillText(thing, 420, 108, 180);
		ctx.fillStyle = 'white';
		ctx.font = '36px Noto';
		let fontSize = 36;
		while (ctx.measureText(mario).width > 800) {
			fontSize--;
			ctx.font = `${fontSize}px Noto`;
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
		ctx.font = '36px Noto';
		fontSize = 36;
		while (ctx.measureText(luigi).width > 800) {
			fontSize--;
			ctx.font = `${fontSize}px Noto`;
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
