const Command = require('../../framework/Command');
const { loadImage } = require('canvas');
const request = require('node-superfetch');
const { gcd } = require('../../util/Util');

module.exports = class AspectRatioCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'aspect-ratio',
			aliases: ['aspect', 'ratio'],
			group: 'analyze',
			memberName: 'aspect-ratio',
			description: 'Determines an image\'s aspect ratio.',
			throttling: {
				usages: 2,
				duration: 10
			},
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to get the aspect ratio of?',
					type: 'image-or-avatar'
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const common = gcd(data.width, data.height);
			return msg.reply(`This image has an aspect ratio of **${data.width / common}:${data.height / common}**.`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
