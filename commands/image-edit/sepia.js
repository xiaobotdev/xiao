const { Command } = require('discord.js-commando');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const { sepia } = require('../../util/Canvas');

module.exports = class SepiaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sepia',
			group: 'image-edit',
			memberName: 'sepia',
			description: 'Draws an image or a user\'s avatar in sepia.',
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
			sepia(ctx, 0, 0, data.width, data.height);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'sepia.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
