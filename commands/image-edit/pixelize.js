const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = class PixelizeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pixelize',
			group: 'image-edit',
			memberName: 'pixelize',
			description: 'Draws an image or a user\'s avatar pixelized.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image|avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const { body } = await request.get(image);
			const avatar = await loadImage(body);
			const canvas = createCanvas(512, 512);
			const ctx = canvas.getContext('2d');
			ctx.imageSmoothingEnabled = false;
			const width = canvas.width * 0.25;
			const height = canvas.height * 0.25;
			ctx.drawImage(avatar, 0, 0, width, height);
			ctx.drawImage(canvas, 0, 0, width, height, 0, 0, canvas.width, canvas.height);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'pixelize.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
