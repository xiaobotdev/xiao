const Command = require('../../structures/Command');
const { loadImage } = require('canvas');
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
				usages: 1,
				duration: 15
			},
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const { body } = await request.get(image);
			const asciiImg = await this.ascii(body);
			return msg.code(null, asciiImg);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
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
