const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { delay } = require('../../util/Util');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class CatchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'catch',
			aliases: ['everyone-caught-is', 'everyone-caught-is-a'],
			group: 'edit-meme',
			memberName: 'catch',
			description: 'Catch users, revealing who is something.',
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
				}
			],
			args: [
				{
					key: 'is',
					prompt: 'What is everyone who gets caught?',
					type: 'string',
					max: 15
				},
				{
					key: 'time',
					prompt: 'How long should I wait before revealing the second half of the image (in seconds)?',
					type: 'integer',
					max: 60,
					min: 1,
					default: 30
				}
			]
		});
	}

	async run(msg, { is, time }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'catch', 'part-2.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textBaseline = 'top';
		ctx.fillStyle = 'red';
		ctx.font = '25px Noto';
		ctx.fillText('EVERYONE CAUGHT IS A', 45, 165);
		ctx.textAlign = 'center';
		ctx.fillText(is.toUpperCase(), 186, 189);
		await msg.channel.send({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'catch', 'part-1.png')] });
		await delay(time * 1000);
		return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'part-2.png' }] });
	}
};
