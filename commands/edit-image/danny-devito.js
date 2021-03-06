const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { base64 } = require('../../util/Util');
const { FACEPLUSPLUS_KEY, FACEPLUSPLUS_SECRET } = process.env;

module.exports = class DannyDevitoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'danny-devito',
			aliases: ['devito'],
			group: 'edit-image',
			memberName: 'danny-devito',
			description: 'Draws Danny Devito\'s face onto the faces in an image.',
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
		const danny = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'danny-devito.png'));
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
				const width = landmarks.contour_right1.x - landmarks.contour_left1.x;
				const ratio = width / danny.width;
				const height = danny.height * ratio;
				ctx.drawImage(
					danny,
					landmarks.contour_left1.x - (width * 0.75),
					landmarks.contour_left1.y - (height / 2) - (height * 0.75),
					width * 1.5,
					height * 1.5
				);
			}
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'danny-devito.png' }] });
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
