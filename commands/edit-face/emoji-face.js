const Command = require('../../framework/Command');
const { GuildEmoji } = require('discord.js');
const request = require('node-superfetch');
const { createCanvas, loadImage } = require('canvas');
const twemoji = require('twemoji-parser');
const { base64 } = require('../../util/Util');
const { FACEPLUSPLUS_KEY, FACEPLUSPLUS_SECRET } = process.env;

module.exports = class EmojiFaceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emoji-face',
			aliases: ['emoji-f', 'e-face'],
			group: 'edit-face',
			memberName: 'emoji-face',
			description: 'Draws an emoji onto the faces in an image.',
			throttling: {
				usages: 2,
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
					key: 'emoji',
					prompt: 'What emoji do you want to draw?',
					type: 'default-emoji|custom-emoji'
				},
				{
					key: 'image',
					prompt: 'What face would you like to scan?',
					type: 'image-or-avatar'
				}
			]
		});
	}

	async run(msg, { emoji, image }) {
		let emojiURL;
		if (emoji instanceof GuildEmoji) {
			emojiURL = emoji.url;
		} else {
			const parsed = twemoji.parse(emoji);
			if (!parsed.length || !parsed[0].url) return msg.reply('This emoji is not yet supported.');
			emojiURL = parsed[0].url;
		}
		const emojiData = await request.get(emojiURL);
		const emojiImg = await loadImage(emojiData.body);
		if (emojiURL.endsWith('svg')) {
			emojiImg.width *= 4;
			emojiImg.height *= 4;
		}
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
				const ratio = width / emojiImg.width;
				const height = emojiImg.height * ratio;
				ctx.drawImage(
					emojiImg,
					landmarks.contour_left1.x - (width * 0.25),
					landmarks.contour_left1.y - (height / 2) - (height * 0.25),
					width * 1.5,
					height * 1.5
				);
			}
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'emoji-face.png' }] });
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
