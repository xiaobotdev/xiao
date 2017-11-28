const { Command } = require('discord.js-commando');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const { greyscale } = require('../../util/Canvas');

module.exports = class GreyscaleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'greyscale',
			aliases: ['grayscale'],
			group: 'image-edit',
			memberName: 'greyscale',
			description: 'Draws an image or a user\'s avatar in greyscale.',
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
			const { body } = await snekfetch.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(data, 0, 0);
			greyscale(ctx, 0, 0, data.width, data.height);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'greyscale.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
