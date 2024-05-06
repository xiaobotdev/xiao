const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');

module.exports = class RotateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rotate',
			group: 'edit-image',
			memberName: 'rotate',
			description: 'Draws an image or a user\'s avatar but rotated a number of degrees.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			args: [
				{
					key: 'degrees',
					type: 'integer',
					min: -360,
					max: 360
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { degrees, image }) {
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const newDims = this.adjustCanvasSize(data.width, data.height, degrees);
		const canvas = createCanvas(newDims.width, newDims.height);
		const ctx = canvas.getContext('2d');
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate(degrees * (Math.PI / 180));
		ctx.translate(-(canvas.width / 2), -(canvas.height / 2));
		ctx.drawImage(data, (canvas.width / 2) - (data.width / 2), (canvas.height / 2) - (data.height / 2));
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate(-degrees * (Math.PI / 180));
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'rotate.png' }] });
	}

	adjustCanvasSize(width, height, angle) {
		let cos = Math.cos(angle * (Math.PI / 180));
		let sin = Math.sin(angle * (Math.PI / 180));
		if (sin < 0) sin = -sin;
		if (cos < 0) cos = -cos;
		const newWidth = (height * sin) + (width * cos);
		const newHeight = (height * cos) + (width * sin);
		return { width: newWidth, height: newHeight };
	}
};
