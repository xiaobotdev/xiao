const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { base64 } = require('../../util/Util');
const { FACEPLUSPLUS_KEY, FACEPLUSPLUS_SECRET } = process.env;

module.exports = class EyesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'eyes',
			group: 'edit-image',
			memberName: 'eyes',
			description: 'Draws emoji eyes onto the faces in an image.',
			throttling: {
				usages: 1,
				duration: 60
			},
			credit: [
				{
					name: 'Face++ Cognitive Services',
					url: 'https://www.faceplusplus.com/',
					reason: 'Face Detection API',
					reasonURL: 'https://www.faceplusplus.com/face-detection/'
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
		const eyes = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'eyes.png'));
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
				const landmarks = face.landmark;
				const leftWidth = landmarks.left_eye_right_corner.x - landmarks.left_eye_left_corner.x;
				const leftRatio = leftWidth / eyes.width;
				const leftHeight = eyes.height * leftRatio;
				ctx.drawImage(
					eyes,
					landmarks.left_eye_left_corner.x - (leftWidth / 2),
					landmarks.left_eye_left_corner.y - (leftHeight / 2) - (leftHeight / 2),
					leftWidth * 2,
					leftHeight * 2
				);
				const rightWidth = landmarks.right_eye_right_corner.x - landmarks.right_eye_left_corner.x;
				const rightRatio = rightWidth / eyes.width;
				const rightHeight = eyes.height * rightRatio;
				ctx.drawImage(
					eyes,
					landmarks.right_eye_left_corner.x - (rightWidth / 2),
					landmarks.right_eye_left_corner.y - (rightHeight / 2) - (rightHeight / 2),
					rightWidth * 2,
					rightHeight * 2
				);
			}
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'eyes.png' }] });
		} catch (err) {
			if (err.status === 400) return msg.reply('There are no faces in this image.');
			if (err.status === 403) return msg.reply('Hold your horses! The command is overloaded! Try again soon.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async detect(imgData) {
		if (Buffer.byteLength(imgData.body) >= 2e+6) return 'size';
		const { body } = await request
			.post('https://api-us.faceplusplus.com/facepp/v3/detect')
			.attach('image_base64', base64(imgData.body))
			.query({
				api_key: FACEPLUSPLUS_KEY,
				api_secret: FACEPLUSPLUS_SECRET,
				return_landmark: 1
			});
		if (!body.faces || !body.faces.length) return null;
		return body.faces;
	}
};
