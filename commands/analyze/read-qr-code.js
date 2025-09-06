const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { decodeQR } = require('qr/decode.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { shorten } = require('../../util/Util');

module.exports = class ReadQRCodeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'read-qr-code',
			aliases: ['scan-qr-code', 'scan-qr', 'read-qr'],
			group: 'analyze',
			description: 'Reads a QR Code.',
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 256
				}
			]
		});
	}

	async run(msg, { image }) {
		const { body } = await request.get(image);
		const img = await loadImage(body);
		const canvas = createCanvas(img.height, img.width);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);
		const imgData = ctx.getImageData(0, 0, img.width, img.height);
		try {
			const result = await this.readQrCode(imgData);
			return msg.reply(shorten(result, 2000));
		} catch (err) {
			return msg.reply(`Could not read QR Code: \`${err.message}\`.`);
		}
	}

	readQrCode(imgData) {
		return decodeQR(imgData);
	}
};
