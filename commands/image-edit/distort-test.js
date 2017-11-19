const { Command } = require('discord.js-commando');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const { distort } = require('../../util/Canvas');

module.exports = class DistortTestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'distort-test',
			aliases: ['under-water-test'],
			group: 'avatar-edit',
			memberName: 'distort-test',
			description: 'Draws an image or user\'s avatar but distorted.',
			throttling: {
				usages: 1,
				duration: 15
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'level',
					prompt: 'What level of distortion would you like to use?',
					type: 'integer'
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image',
					default: ''
				}
			]
		});
	}

	async run(msg, { level, image }) {
		if (!image) {
			image = msg.author.displayAvatarURL({
				format: 'png',
				size: 512
			});
		}
		try {
			const { body } = await snekfetch.get(image);
			const imageData = await loadImage(body);
			const canvas = createCanvas(imageData.width, imageData.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(imageData, 0, 0);
			distort(ctx, level, 0, 0, imageData.width, imageData.height);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'distort-test.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
