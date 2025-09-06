const Command = require('../../framework/Command');
const { createCanvas } = require('@napi-rs/canvas');
const { encodeQR } = require('qr');

module.exports = class CreateQRCodeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'create-qr-code',
			aliases: ['create-qr'],
			group: 'edit-image',
			description: 'Converts text to a QR Code.',
			args: [
				{
					key: 'text',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		const qr = this.createQRCode(text);
		return msg.say({ files: [{ attachment: qr, name: 'qr-code.png' }] });
	}

	createQRCode(text) {
		const qr = encodeQR(text, 'raw');
		const size = qr.length;
		const scale = 10;
		const canvas = createCanvas(size * scale, size * scale);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'black';
		for (let y = 0; y < size; y++) {
			for (let x = 0; x < size; x++) {
				if (qr[y][x]) {
					ctx.fillRect(x * scale, y * scale, scale, scale);
				}
			}
		}
		return canvas.toBuffer('image/png');
	}
};
