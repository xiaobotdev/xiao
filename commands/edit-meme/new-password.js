const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { shortenText } = require('../../util/Canvas');

module.exports = class NewPasswordCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'new-password',
			aliases: ['strong-password', 'new-pswd', 'strong-pswd', 'new-pass', 'strong-pass'],
			group: 'edit-meme',
			memberName: 'new-password',
			description: 'Sends a "Weak Password/Strong Password" meme with the passwords of your choice.',
			throttling: {
				usages: 2,
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
					key: 'weak',
					type: 'string',
					max: 50
				},
				{
					key: 'strong',
					type: 'string',
					max: 50
				}
			]
		});
	}

	async run(msg, { weak, strong }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'new-password.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(60);
		ctx.fillText(shortenText(ctx, weak, 780), 70, 191);
		ctx.fillText(shortenText(ctx, strong, 780), 70, 667);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'new-password.png' }] });
	}
};
