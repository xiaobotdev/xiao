const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');
const { firstUpperCase } = require('../../util/Util');

module.exports = class ICantBelieveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'i-cant-believe',
			aliases: ['not-butter', 'i-cant-believe-its-not', 'cant-believe', 'cant-believe-its-not'],
			group: 'edit-meme',
			memberName: 'i-cant-believe',
			description: 'Sends a "I Can\'t believe it\'s not butter!" meme with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'I Can\'t Believe It\'s Not Butter!',
					url: 'https://www.icantbelieveitsnotbutter.com/en',
					reason: 'Original Logo'
				},
				{
					name: 'Kong Font',
					url: 'https://www.dafont.com/kong-font.d8299',
					reason: 'The Lord Night Font',
					reasonURL: 'https://www.dafont.com/the-lord-night.font'
				}
			],
			args: [
				{
					key: 'text',
					type: 'string',
					max: 15
				}
			]
		});
	}

	async run(msg, { text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'i-cant-believe.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.textBaseline = 'top';
		ctx.drawImage(base, 0, 0);
		ctx.rotate(-8 * (Math.PI / 180));
		ctx.font = this.client.fonts.get('The Lord Night.ttf').toCanvasString(94);
		ctx.lineWidth = 6;
		ctx.strokeStyle = 'white';
		ctx.strokeText(firstUpperCase(text.toLowerCase(), null), 13, 54, 171);
		ctx.fillStyle = '#13487b';
		ctx.fillText(firstUpperCase(text.toLowerCase(), null), 13, 64, 171);
		ctx.rotate(8 * (Math.PI / 180));
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'i-cant-believe.png' }] });
	}
};
