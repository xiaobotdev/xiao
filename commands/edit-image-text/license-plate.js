const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');

module.exports = class LicensePlateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'license-plate',
			group: 'edit-image-text',
			memberName: 'license-plate',
			description: 'Creates a license plate with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Dave Hansen',
					url: 'https://www.fontspace.com/dave-hansen',
					reason: 'License Plate Font',
					reasonURL: 'https://www.fontspace.com/license-plate-font-f3359'
				},
				{
					name: 'Pin Clipart',
					url: 'https://www.pinclipart.com/',
					reason: 'Image',
					reasonURL: 'https://www.pinclipart.com/maxpin/bJxii/'
				}
			],
			args: [
				{
					key: 'text',
					type: 'string',
					max: 10
				}
			]
		});
	}

	async run(msg, { text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'license-plate.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.font = this.client.fonts.get('LicensePlate.ttf').toCanvasString(180);
		ctx.fillText(text.toUpperCase(), base.width / 2, base.height / 2, 700);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'license-plate.png' }] });
	}
};
