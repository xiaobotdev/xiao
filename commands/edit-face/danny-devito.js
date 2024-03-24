const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class DannyDevitoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'danny-devito',
			aliases: ['devito'],
			group: 'edit-face',
			memberName: 'danny-devito',
			description: 'Draws Danny Devito\'s face onto the faces in an image.',
			throttling: {
				usages: 1,
				duration: 60
			},
			credit: [
				{
					name: 'Danny DeVito',
					url: 'https://twitter.com/dannydevito',
					reason: 'Himself'
				}
			],
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
		const danny = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'danny-devito.png'));
		const imgData = await request.get(image);
		const faces = await this.client.detectFaces(imgData.body);
		if (!faces) return msg.reply('There are no faces in this image.');
		if (faces === 'size') return msg.reply('This image is too large.');
		const base = await loadImage(imgData.body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		for (const face of faces) {
			const ratio = face.box.width / danny.width;
			const height = danny.height * ratio;
			ctx.drawImage(
				danny,
				face.box.xMin - (face.box.width * 0.25),
				face.box.yMin - (height / 2) - (height * 0.25),
				face.box.width * 1.5,
				height * 1.5
			);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'danny-devito.png' }] });
	}
};
