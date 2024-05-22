const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const ntc = require('ntcjs');
const { rgbToHex } = require('../../util/Util');

module.exports = class DominantColorCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dominant-color',
			aliases: ['dom-color', 'dominant-colour', 'dom-colour'],
			group: 'analyze',
			description: 'Determines the dominant color of an image.',
			throttling: {
				usages: 2,
				duration: 10
			},
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 256
				}
			]
		});
	}

	async run(msg, { image }) {
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(250, 250);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0, 1, 1);
		const imgData = ctx.getImageData(0, 0, 1, 1).data;
		const hexColor = `#${rgbToHex(imgData[0], imgData[1], imgData[2]).padStart(6, '0')}`;
		ctx.fillStyle = hexColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		const name = ntc.name(hexColor);
		return msg.say(`${hexColor.toUpperCase()} - ${name[1]}`, {
			files: [{ attachment: canvas.toBuffer('image/png'), name: 'dominant-color.png' }]
		});
	}
};
