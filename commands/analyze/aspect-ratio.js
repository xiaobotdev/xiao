const Command = require('../../structures/Command');
const { loadImage } = require('canvas');
const request = require('node-superfetch');

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
			return msg.reply(`This image has an aspect ratio of **${this.ratio(data.width, data.height)}**.`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	gcd(a, b) {
		if (b > a) {
			const temp = a;
			a = b;
			b = temp;
		}
		while (b !== 0) {
			const m = a % b;
			a = b;
			b = m;
		}
		return a;
	}

	ratio(x, y) {
		const c = this.gcd(x, y);
		return `${x / c}:${y / c}`;
	}
};
