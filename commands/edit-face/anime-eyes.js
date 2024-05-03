const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');

module.exports = class AnimeEyesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'anime-eyes',
			aliases: ['ani-eyes', 'manga-eyes'],
			group: 'edit-face',
			memberName: 'anime-eyes',
			description: 'Draws anime eyes onto the faces in an image.',
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
		const leftEye = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'anime-eyes', 'left.png'));
		const rightEye = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'anime-eyes', 'right.png'));
		const imgData = await request.get(image);
		const faces = await this.client.tensorflow.detectFaces(imgData.body);
		if (!faces) return msg.reply('There are no faces in this image.');
		if (faces === 'size') return msg.reply('This image is too large.');
		const base = await loadImage(imgData.body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		for (const face of faces) {
			const eyeWidth = face.box.width / 4;
			const eyeHeight = face.box.height / 4;
			const leftEyeData = face.keypoints.find(landmark => landmark.name === 'leftEye');
			const rightEyeData = face.keypoints.find(landmark => landmark.name === 'rightEye');
			const leftEyeX = leftEyeData.x - (eyeWidth / 2);
			const leftEyeY = leftEyeData.y - (eyeHeight / 2);
			const rightEyeX = rightEyeData.x - (eyeWidth / 2);
			const rightEyeY = rightEyeData.y - (eyeHeight / 2);
			ctx.drawImage(rightEye, leftEyeX, leftEyeY, eyeWidth, eyeHeight);
			ctx.drawImage(leftEye, rightEyeX, rightEyeY, eyeWidth, eyeHeight);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'anime-eyes.png' }] });
	}
};
