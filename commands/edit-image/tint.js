const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { drawImageWithTint } = require('../../util/Canvas');

module.exports = class TintCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tint',
			group: 'edit-image',
			memberName: 'tint',
			description: 'Draws an image or a user\'s avatar but tinted a specific color.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'color',
					type: 'string',
					parse: color => color.toLowerCase()
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { color, image }) {
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		drawImageWithTint(ctx, data, color, 0, 0, data.width, data.height);
		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
		return msg.say({ files: [{ attachment, name: 'tint.png' }] });
	}
};
