const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = class RotateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rotate',
			group: 'edit-image',
			memberName: 'rotate',
			description: 'Draws an image or a user\'s avatar but rotated a number of degrees.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'degrees',
					prompt: 'How many degrees do you want to rotate the image?',
					type: 'integer',
					min: -360,
					max: 360
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

	async run(msg, { degrees, image }) {
		try {
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
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'rotate.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
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
