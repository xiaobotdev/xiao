const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { rgbToHex } = require('../../util/Util');

module.exports = class DominantColorCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dominant-color',
			aliases: ['dom-color', 'dominant-colour', 'dom-colour'],
			group: 'analyze',
			memberName: 'dominant-color',
			description: 'Determines the dominant color of an image.',
			throttling: {
				usages: 1,
				duration: 10
			},
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to test?',
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(250, 250);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(data, 0, 0, 1, 1);
			const imgData = ctx.getImageData(0, 0, 1, 1).data;
			const hexColor = `#${rgbToHex(imgData[0], imgData[1], imgData[2]).padStart(6, '0')}`;
			ctx.fillStyle = hexColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			return msg.say(hexColor, { files: [{ attachment: canvas.toBuffer(), name: 'dominant-color.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
