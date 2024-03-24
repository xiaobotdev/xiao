const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { createCanvas, loadImage } = require('canvas');
const tfnode = require('@tensorflow/tfjs-node');
const faceDetection = require('@tensorflow-models/face-detection');
const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
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
					prompt: 'What face would you like to scan?',
					type: 'image-or-avatar'
				}
			]
		});

		this.detector = null;
	}

	async run(msg, { image }) {
		if (!this.detector) this.detector = await faceDetection.createDetector(model, { runtime: 'tfjs', maxFaces: 10 });
		const leftEye = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'anime-eyes', 'left.png'));
		const rightEye = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'anime-eyes', 'right.png'));
		const imgData = await request.get(image);
		try {
			const faces = await this.detect(imgData);
			if (!faces) return msg.reply('There are no faces in this image.');
			if (faces === 'size') return msg.reply('This image is too large.');
			const base = await loadImage(imgData.body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			for (const face of faces) {
				const faceWidth = face.box.width;
				const faceHeight = face.box.height;
				const leftEye = face.keypoints.find(landmark => landmark.name === 'leftEye');
				ctx.drawImage(leftEye, leftEye.x, leftEye.y, faceWidth / 10, faceHeight / 10);
				const rightEye = face.keypoints.find(landmark => landmark.name === 'rightEye');
				ctx.drawImage(rightEye, rightEye.x, rightEye.y, faceWidth / 10, faceHeight / 10);
			}
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'anime-eyes.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async detect(imgData) {
		if (Buffer.byteLength(imgData.body) >= 2e+6) return 'size';
		tfnode.setBackend('tensorflow');
		const image = tfnode.node.decodeImage(imgData);
		tfnode.setBackend('cpu');
		const faces = await detector.estimateFaces(image);
		tfnode.setBackend('tensorflow');
		if (!faces || !faces.length) return null;
		return faces;
	}
};
