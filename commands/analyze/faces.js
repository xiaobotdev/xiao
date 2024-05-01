const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { createCanvas, loadImage } = require('canvas');

module.exports = class FacesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'faces',
			aliases: ['face'],
			group: 'analyze',
			memberName: 'faces',
			description: 'Shows all detected faces in an image.',
			throttling: {
				usages: 1,
				duration: 60
			},
			args: [
				{
					key: 'image',
					type: 'image-or-avatar'
				}
			]
		});
	}

	async run(msg, { image }) {
		const imgData = await request.get(image);
		const faces = await this.client.tensorflow.detectFaces(imgData.body);
		if (!faces) return msg.reply('There are no faces in this image.');
		if (faces === 'size') return msg.reply('This image is too large.');
		const base = await loadImage(imgData.body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		for (const face of faces) {
			const lineSize = base.width / 70;
			ctx.fillStyle = 'blue';
			ctx.fillRect(face.box.xMin, face.box.yMin, lineSize, face.box.height);
			ctx.fillRect(face.box.xMin, face.box.yMin, face.box.width, lineSize);
			ctx.fillRect(face.box.xMin, face.box.yMax, face.box.width + lineSize, lineSize);
			ctx.fillRect(face.box.xMax, face.box.yMin, lineSize, face.box.height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'faces.png' }] });
	}
};
