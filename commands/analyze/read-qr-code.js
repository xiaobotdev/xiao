const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { shorten } = require('../../util/Util');

module.exports = class ReadQRCodeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'read-qr-code',
			aliases: ['scan-qr-code', 'scan-qr', 'read-qr'],
			group: 'analyze',
			description: 'Reads a QR Code.',
			credit: [
				{
					name: 'goQR.me',
					url: 'http://goqr.me/',
					reason: 'QR code API',
					reasonURL: 'http://goqr.me/api/'
				}
			],
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
		const { body } = await request
			.get('https://api.qrserver.com/v1/read-qr-code/')
			.query({ fileurl: image });
		const data = body[0].symbol[0];
		if (!data.data) return msg.reply(`Could not read QR Code: ${data.error}.`);
		return msg.reply(shorten(data.data, 2000 - (msg.author.toString().length + 2)));
	}
};
