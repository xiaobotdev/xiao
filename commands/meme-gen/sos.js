const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class SosCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sos',
			aliases: ['esther-verkest', 'esther', 'help-sign'],
			group: 'meme-gen',
			memberName: 'sos',
			description: 'Sends a "Esther Verkest\'s Help Sign" comic with the text of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Esther Verkest',
					url: 'https://www.facebook.com/Esther-Verkest-49667161749/',
					reason: 'Image'
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
					key: 'message',
					prompt: 'What should Esther spell out to signal for help?',
					type: 'string',
					max: 21
				}
			]
		});
	}

	async run(msg, { message }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'sos.png'));
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.font = '35px Noto';
			ctx.fillStyle = 'black';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.rotate(-15 * (Math.PI / 180));
			const lines = await wrapText(ctx, message, 130);
			ctx.fillText(lines.join('\n'), 362, 522);
			ctx.rotate(15 * (Math.PI / 180));
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'sos.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
