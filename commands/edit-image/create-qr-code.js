const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class CreateQRCodeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'create-qr-code',
			aliases: ['create-qr'],
			group: 'edit-image',
			memberName: 'create-qr-code',
			description: 'Converts text to a QR Code.',
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
					key: 'text',
					prompt: 'What text would you like to convert to a QR Code?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { text }) {
		const { body } = await request
			.get('https://api.qrserver.com/v1/create-qr-code/')
			.query({ data: text });
		return msg.say({ files: [{ attachment: body, name: 'qr-code.png' }] });
	}
};
