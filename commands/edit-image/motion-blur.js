const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { motionBlur } = require('../../util/Canvas');

module.exports = class MotionBlurCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'motion-blur',
			aliases: ['m-blur', 'motion'],
			group: 'edit-image',
			memberName: 'motion-blur',
			description: 'Draws an image or a user\'s avatar with motion blur.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		motionBlur(ctx, data, 0, 0, data.width, data.height);
		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
		return msg.say({ files: [{ attachment, name: 'motion-blur.png' }] });
	}
};
