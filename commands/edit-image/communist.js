const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImage, drawImageWithTint } = require('../../util/Canvas');

module.exports = class CommunistCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'communist',
			aliases: ['commie', 'communism'],
			group: 'edit-image',
			memberName: 'communist',
			description: 'Draws the Communist flag over an image or a user\'s avatar.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'PNGFuel',
					url: 'https://www.pngfuel.com/',
					reason: 'Image',
					reasonURL: 'https://www.pngfuel.com/free-png/osnol'
				}
			],
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'communist.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			drawImageWithTint(ctx, data, 'red', 0, 0, data.width, data.height);
			const { x, y, width, height } = centerImage(base, data);
			ctx.globalAlpha = 0.5;
			ctx.drawImage(base, x, y, width * 0.9, height * 0.9);
			ctx.globalAlpha = 1;
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'communist.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
