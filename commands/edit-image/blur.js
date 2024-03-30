const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const stackBlur = require('stackblur-canvas');

module.exports = class BlurCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'blur',
			aliases: ['gaussian', 'gaussian-blur', 'stackblur'],
			group: 'edit-image',
			memberName: 'blur',
			description: 'Draws an image or a user\'s avatar but blurred.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'radius',
					type: 'integer',
					max: 180,
					min: 1
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { radius, image }) {
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		stackBlur.canvasRGBA(canvas, 0, 0, canvas.width, canvas.height, radius);
		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
		return msg.say({ files: [{ attachment, name: 'blur.png' }] });
	}
};
