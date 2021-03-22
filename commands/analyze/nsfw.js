const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { isImageNSFW } = require('../../util/Util');

module.exports = class NsfwCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nsfw',
			aliases: ['nsfw-image', 'nsfw-img', 'img-nsfw', 'image-nsfw'],
			group: 'analyze',
			memberName: 'nsfw',
			description: 'Determines if an image is NSFW.',
			throttling: {
				usages: 1,
				duration: 30
			},
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to test?',
					type: 'image-or-avatar'
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const { body } = await request.get(image);
			const prediction = await isImageNSFW(this.client.nsfwModel, body, false);
			return msg.reply(`I'm **${prediction.probability}%** sure this image is: **${prediction.className}**.`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
