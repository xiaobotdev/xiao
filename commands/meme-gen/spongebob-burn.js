const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class SpongebobBurnCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'spongebob-burn',
			aliases: ['sponge-burn', 'spongebob-fire', 'sponge-fire'],
			group: 'meme-gen',
			memberName: 'spongebob-burn',
			description: 'Sends a "Spongebob Throwing Something into a Fire" meme with words of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Nickelodeon',
					url: 'https://www.nick.com/',
					reason: 'Image, Original "Spongebob Squarepants" Show',
					reasonURL: 'https://www.nick.com/shows/spongebob-squarepants'
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
					key: 'burn',
					label: 'thing to burn',
					prompt: 'What should Spongebob burn?',
					type: 'string',
					max: 150
				},
				{
					key: 'person',
					prompt: 'What should Spongebob be labelled as?',
					type: 'string',
					max: 15
				}
			]
		});
	}

	async run(msg, { burn, person }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'spongebob-burn.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.fillStyle = 'black';
		ctx.textBaseline = 'top';
		ctx.font = '35px Noto';
		let fontSize = 35;
		while (ctx.measureText(burn).width > 400) {
			fontSize -= 1;
			ctx.font = `${fontSize}px Noto`;
		}
		const lines = await wrapText(ctx, burn, 180);
		ctx.fillText(lines.join('\n'), 55, 103);
		ctx.font = '25px Noto';
		ctx.fillText(person, 382, 26);
		ctx.font = '20px Noto';
		ctx.fillText(person, 119, 405);
		ctx.fillText(person, 439, 434);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'spongebob-burn.png' }] });
	}
};
