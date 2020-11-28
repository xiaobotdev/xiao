const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'SunDried.ttf'), { family: 'Sun Dried' });

module.exports = class SosCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sos',
			aliases: ['esther-verkest', 'esther', 'help-sign'],
			group: 'edit-meme',
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
					max: 10
				}
			]
		});
	}

	async run(msg, { message }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'sos.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = '90px Sun Dried';
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.rotate(15 * (Math.PI / 180));
		let fontSize = 90;
		while (ctx.measureText(message).width > 140) {
			fontSize--;
			ctx.font = `${fontSize}px Sun Dried`;
		}
		ctx.fillText(message.toUpperCase(), 362, 522);
		ctx.rotate(-15 * (Math.PI / 180));
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'sos.png' }] });
	}
};
