const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { sepia, centerImagePart } = require('../../util/Canvas');

module.exports = class WantedCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wanted',
			aliases: ['wanted-poster'],
			group: 'edit-image',
			memberName: 'wanted',
			description: 'Draws an image or a user\'s avatar over a wanted poster.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Tim\'s Printables',
					url: 'https://www.timvandevall.com/',
					reason: 'Image',
					reasonURL: 'https://www.pinterest.com/pin/365002744774849370/'
				}
			],
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'wanted.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			const { x, y, width, height } = centerImagePart(data, 430, 430, 150, 360);
			ctx.drawImage(data, x, y, width, height);
			sepia(ctx, x, y, width, height);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'wanted.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
