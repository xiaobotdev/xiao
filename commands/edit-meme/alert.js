const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'SF-Pro-Display-Medium.otf'), { family: 'SF Pro' });

module.exports = class AlertCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'alert',
			aliases: ['presidential-alert'],
			group: 'edit-meme',
			memberName: 'alert',
			description: 'Sends a Presidential Alert message with the text of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Overtime2005',
					url: 'https://github.com/Overtime2005',
					reason: 'Concept'
				},
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
					// eslint-disable-next-line max-len
					reasonURL: 'https://thehill.com/policy/technology/409737-this-is-a-test-us-officials-test-presidential-alert'
				}
			],
			args: [
				{
					key: 'message',
					prompt: 'What should the alert say?',
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
		ctx.font = '28px SF Pro';
		ctx.fillStyle = 'black';
		ctx.textBaseline = 'top';
		let text = await wrapText(ctx, message, 540);
		text = text.length > 3 ? `${text.slice(0, 3).join('\n')}...` : text.join('\n');
		ctx.fillText(text, 47, 186);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'alert.png' }] });
	}
};
