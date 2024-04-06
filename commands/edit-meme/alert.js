const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class AlertCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'alert',
			aliases: ['presidential-alert'],
			group: 'edit-meme',
			memberName: 'alert',
			description: 'Sends a Presidential Alert message with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Apple',
					url: 'https://www.apple.com/',
					reason: 'San Francisco Font',
					reasonURL: 'https://developer.apple.com/fonts/'
				},
				{
					name: 'The Hill',
					url: 'https://thehill.com/',
					reason: 'Image',
					reasonURL: 'https://thehill.com/policy/technology/409737-this-is-a-test-us-officials-test-presidential-alert'
				}
			],
			args: [
				{
					key: 'message',
					type: 'string',
					max: 280
				}
			]
		});
	}

	async run(msg, { message }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'alert.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = this.client.fonts.get('SF-Pro-Display-Medium.otf').toCanvasString(30);
		ctx.fillStyle = '#1f1f1f';
		ctx.textBaseline = 'top';
		let text = await wrapText(ctx, message, 540);
		text = text.length > 3 ? `${text.slice(0, 3).join('\n')}...` : text.join('\n');
		ctx.fillText(text, 48, 178);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'alert.png' }] });
	}
};
