const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const request = require('node-superfetch');
const path = require('path');
const { streamToArray } = require('../../util/Util');
const { centerImagePart } = require('../../util/Canvas');
const frameCount = 10;

module.exports = class PetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pet',
			group: 'edit-image',
			memberName: 'pet',
			description: 'Pets an image or a user\'s avatar.',
			throttling: {
				usages: 2,
				duration: 30
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 128 })
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const encoder = new GIFEncoder(112, 112);
			const canvas = createCanvas(112, 112);
			const ctx = canvas.getContext('2d');
			const stream = encoder.createReadStream();
			encoder.start();
			encoder.setRepeat(0);
			encoder.setDelay(20);
			encoder.setQuality(200);
			encoder.setTransparent('#000000');
			let squish = 0;
			for (let i = 0; i < frameCount; i++) {
				const frameID = `frame_${i.toString().padStart(2, '0')}.png`;
				const frame = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'pet', frameID));
				const { x, y, width, height } = centerImagePart(data, 75, 75, 27, 38);
				ctx.drawImage(data, x - (squish / 2), y + squish, width + squish, height - squish);
				ctx.drawImage(frame, 0, 0);
				encoder.addFrame(ctx);
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				if (i + 1 > frameCount / 2) squish -= 4;
				else squish += 4;
			}
			encoder.finish();
			const buffer = await streamToArray(stream);
			return msg.say({ files: [{ attachment: Buffer.concat(buffer), name: 'pet.gif' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
