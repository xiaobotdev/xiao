const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');
const { wrapText, fillTextWithBreaks } = require('../../util/Canvas');

module.exports = class DearLiberalsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dear-liberals',
			aliases: ['turning-point-usa', 'ben-shapiro'],
			group: 'edit-meme',
			memberName: 'dear-liberals',
			description: 'Sends a "Dear Liberals" meme with words of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Turning Point USA',
					url: 'https://www.tpusa.com/',
					reason: 'Image'
				},
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Oswald Font',
					reasonURL: 'https://fonts.google.com/specimen/Oswald'
				}
			],
			args: [
				{
					key: 'hashtag',
					type: 'string',
					max: 10,
					validate: hashtag => /^[A-Z0-9]+$/i.test(hashtag)
				},
				{
					key: 'blueText',
					label: 'blue text',
					type: 'string',
					max: 42,
					parse: blueText => blueText.toUpperCase()
				},
				{
					key: 'redText',
					label: 'red text',
					type: 'string',
					max: 24,
					parse: redText => redText.toUpperCase()
				}
			]
		});
	}

	async run(msg, { hashtag, blueText, redText }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'dear-liberals.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.fillStyle = 'white';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('Oswald-SemiBold.ttf').toCanvasString(20);
		ctx.rotate(12.30 * (Math.PI / 180));
		ctx.fillText(`#${hashtag}`, 200, 210);
		ctx.rotate(-12.30 * (Math.PI / 180));
		ctx.fillStyle = '#002046';
		ctx.font = this.client.fonts.get('Oswald-SemiBold.ttf').toCanvasString(27);
		const blueLines = wrapText(ctx, blueText, 270);
		fillTextWithBreaks(ctx, blueLines.join('\n'), 207, 90);
		ctx.fillStyle = '#c31a41';
		const redLines = wrapText(ctx, redText, 165);
		fillTextWithBreaks(ctx, redLines.join('\n'), 326, 236);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'dear-liberals.png' }] });
	}
};
