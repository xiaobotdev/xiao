const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class RejctedCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rejected',
			aliases: ['reject'],
			group: 'image-edit',
			memberName: 'rejected',
			description: 'Draws a "rejected" stamp over an image or a user\'s avatar.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
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
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'rejected.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(data, 0, 0);
			const dataRatio = data.width / data.height;
			const baseRatio = base.width / base.height;
			let { width, height } = data;
			let x = 0;
			let y = 0;
			if (baseRatio < dataRatio) {
				height = data.height;
				width = base.width * (height / base.height);
				x = (data.width - width) / 2;
				y = 0;
			} else if (baseRatio > dataRatio) {
				width = data.width;
				height = base.height * (width / base.width);
				x = 0;
				y = (data.height - height) / 2;
			}
			ctx.drawImage(base, x, y, width, height);
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'rejected.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
