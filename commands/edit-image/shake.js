const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gif-encoder-2');
const request = require('node-superfetch');

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
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			args: [
				{
					key: 'amount',
					type: 'integer',
					max: 50,
					min: 1
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { amount, image }) {
		const { body } = await request.get(image);
		const base = await loadImage(body);
		const ratio = base.width / base.height;
		const height = 512 / ratio;
		const encoder = new GIFEncoder(512, height, 'octree', true);
		const canvas = createCanvas(512, height);
		const ctx = canvas.getContext('2d');
		encoder.start();
		encoder.setRepeat(0);
		encoder.setDelay(20);
		encoder.setQuality(10);
		const frames = this.generateFrames(amount);
		for (const { x, y } of frames) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(base, x, y, 512, height);
			encoder.addFrame(ctx);
		}
		encoder.finish();
		const attachment = encoder.out.getData();
		return msg.say({ files: [{ attachment, name: 'shake.gif' }] });
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
