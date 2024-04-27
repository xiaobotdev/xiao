const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class ShrekCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shrek',
			group: 'edit-face',
			memberName: 'shrek',
			description: 'Draws Shrek\'s face onto the faces in an image.',
			throttling: {
				usages: 1,
				duration: 60
			},
			credit: [
				{
					name: 'DreamWorks',
					url: 'https://www.dreamworks.com/',
					reasonURL: 'https://www.dreamworks.com/movies/shrek',
					reason: 'Images, Original "Shrek" Movie'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar'
				}
			]
		});
	}

	async run(msg, { image }) {
		const shrek = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'shrek.png'));
		const imgData = await request.get(image);
		const faces = await this.client.detectFaces(imgData.body);
		if (!faces) return msg.reply('There are no faces in this image.');
		if (faces === 'size') return msg.reply('This image is too large.');
		const base = await loadImage(imgData.body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		for (const face of faces) {
			const ratio = face.box.width / shrek.width;
			const height = shrek.height * ratio;
			ctx.drawImage(
				shrek,
				face.box.xMin - (face.box.width * 0.2),
				face.box.yMin - (height / 2.5),
				face.box.width * 1.6,
				height * 1.6
			);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'shrek.png' }] });
	}
};
