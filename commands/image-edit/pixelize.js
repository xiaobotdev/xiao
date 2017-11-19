const { Command } = require('discord.js-commando');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');

module.exports = class PixelizeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pixelize',
			aliases: ['jpeg', 'needs-more-jpeg'],
			group: 'image-edit',
			memberName: 'pixelize',
			description: 'Draws an image or a user\'s avatar but pixelized.',
			throttling: {
				usages: 1,
				duration: 15
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image',
					default: ''
				}
			]
		});
	}

	async run(msg, { image }) {
		if (!image) {
			image = msg.author.displayAvatarURL({
				format: 'png',
				size: 64
			});
		}
		try {
			const { body } = await snekfetch.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(512, 512);
			const ctx = canvas.getContext('2d');
			ctx.imageSmoothingEnabled = false;
			ctx.drawImage(data, 0, 0, 512, 512);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'pixelize.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
