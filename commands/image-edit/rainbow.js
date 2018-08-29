const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class RainbowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rainbow',
			aliases: ['gay'],
			group: 'image-edit',
			memberName: 'rainbow',
			description: 'Draws a rainbow over an image or a user\'s avatar.',
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
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'rainbow.png'));
			const { body } = await request.get(image);
			const avatar = await loadImage(body);
			const canvas = createCanvas(avatar.width, avatar.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(avatar, 0, 0);
			ctx.drawImage(base, 0, 0, avatar.width, avatar.height);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'rainbow.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
