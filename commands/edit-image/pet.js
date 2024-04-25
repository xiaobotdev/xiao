const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gif-encoder-2');
const request = require('node-superfetch');
const path = require('path');
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
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 128 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const encoder = new GIFEncoder(112, 112);
		const canvas = createCanvas(112, 112);
		const ctx = canvas.getContext('2d');
		encoder.start();
		encoder.setRepeat(0);
		encoder.setDelay(20);
		encoder.setQuality(10);
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
		const attachment = encoder.out.getData();
		return msg.say({ files: [{ attachment, name: 'pet.gif' }] });
	}
};
