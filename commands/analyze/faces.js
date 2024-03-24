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
					prompt: 'What face would you like to scan?',
					type: 'image-or-avatar'
				}
			]
		});
	}

	async run(msg, { image }) {
		const imgData = await request.get(image);
		const faces = await this.client.detectFaces(imgData.body);
		if (!faces) return msg.reply('There are no faces in this image.');
		if (faces === 'size') return msg.reply('This image is too large.');
		const base = await loadImage(imgData.body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		for (const face of faces) {
			ctx.fillStyle = 'blue';
			ctx.fillRect(face.box.xMin, face.box.yMin, 10, face.box.height);
			ctx.fillRect(face.box.xMin, face.box.yMin, face.box.width, 10);
			ctx.fillRect(face.box.xMin, face.box.yMax, face.box.width, 10);
			ctx.fillRect(face.box.xMax, face.box.yMin, 10, face.box.height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'faces.png' }] });
	}
};
