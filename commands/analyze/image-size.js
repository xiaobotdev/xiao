const Command = require('../../structures/Command');
const { loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = class ImageSizeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'image-size',
			aliases: ['img-size', 'size', 'dimensions', 'image-dimensions', 'img-dimensions'],
			group: 'analyze',
			memberName: 'image-size',
			description: 'Determines the size of an image.',
			throttling: {
				usages: 2,
				duration: 10
			},
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to get the size of?',
					type: 'image-or-avatar'
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const { body } = await request.get(image);
			const data = await loadImage(body);
			return msg.reply(`This image is ${data.width}x${data.height}.`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
