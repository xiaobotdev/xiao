const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const request = require('node-superfetch');
const { streamToArray } = require('../../util/Util');

module.exports = class ShakeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shake',
			aliases: ['shook'],
			group: 'edit-image',
			memberName: 'shake',
			description: 'Draws an image or a user\'s avatar shaking.',
			throttling: {
				usages: 2,
				duration: 30
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'amount',
					prompt: 'How much do you want to shake the image? Give a number, like 1.',
					type: 'integer',
					max: 50,
					min: 1
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { amount, image }) {
		const { body } = await request.get(image);
		const base = await loadImage(body);
		const ratio = base.width / base.height;
		const height = 512 / ratio;
		const encoder = new GIFEncoder(512, height);
		const canvas = createCanvas(512, height);
		const ctx = canvas.getContext('2d');
		const stream = encoder.createReadStream();
		encoder.start();
		encoder.setRepeat(0);
		encoder.setDelay(20);
		encoder.setQuality(200);
		const frames = this.generateFrames(amount);
		for (const { x, y } of frames) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(base, x, y, 512, height);
			encoder.addFrame(ctx);
		}
		encoder.finish();
		const buffer = await streamToArray(stream);
		return msg.say({ files: [{ attachment: Buffer.concat(buffer), name: 'shake.gif' }] });
	}

	generateFrames(amount) {
		amount *= 5;
		return [
			{ x: -amount, y: 0 },
			{ x: 0, y: -amount },
			{ x: 0, y: 0 },
			{ x: amount, y: 0 },
			{ x: 0, y: amount },
			{ x: 0, y: 0 }
		];
	}
};
