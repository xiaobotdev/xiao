const { Command } = require('discord.js-commando');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const { silhouette } = require('../../util/Canvas');

module.exports = class SilhouetteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'silhouette',
			group: 'image-edit',
			memberName: 'silhouette',
			description: 'Draws a silhouette of an image or a user\'s avatar.',
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
				size: 512
			});
		}
		try {
			const { body } = await snekfetch.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(data, 0, 0);
			silhouette(ctx, 0, 0, data.width, data.height);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'silhouette.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
