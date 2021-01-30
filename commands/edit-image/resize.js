const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = class ResizeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'resize',
			group: 'edit-image',
			memberName: 'resize',
			description: 'Draws an image or a user\'s avatar resized to the size you want.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'width',
					prompt: 'What do you want the new width of the image to be?',
					type: 'integer',
					min: 1,
					max: 2000
				},
				{
					key: 'height',
					prompt: 'What do you want the new height of the image to be?',
					type: 'integer',
					min: 1,
					max: 2000
				},
				{
					key: 'image',
					prompt: 'Which image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 2048 })
				}
			]
		});
	}

	async run(msg, { width, height, image }) {
		try {
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(width, height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(data, 0, 0, width, height);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'resize.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
