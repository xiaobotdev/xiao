const Command = require('../../framework/Command');
const { loadImage } = require('@napi-rs/canvas');
const imageToAscii = require('image-to-ascii');
const request = require('node-superfetch');

module.exports = class AsciiCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ascii',
			group: 'edit-image',
			memberName: 'ascii',
			description: 'Draws an image or a user\'s avatar but with ascii.',
			throttling: {
				usages: 2,
				duration: 15
			},
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 512,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const { body } = await request.get(image);
		const asciiImg = await this.ascii(body);
		return msg.code(null, asciiImg);
	}

	async ascii(image) {
		const { width, height } = await loadImage(image);
		const options = {
			colored: false,
			size: {
				height: height >= width ? 20 : undefined,
				width: width > height ? 20 : undefined
			}
		};
		return new Promise((res, rej) => {
			imageToAscii(image, options, (err, converted) => {
				if (err) return rej(err);
				return res(converted);
			});
		});
	}
};
