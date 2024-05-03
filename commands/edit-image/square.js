const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');

module.exports = class SquareCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'square',
			group: 'edit-image',
			memberName: 'square',
			description: 'Draws an image or a user\'s avatar as a square.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const dimensions = data.width <= data.height ? data.width : data.height;
		const canvas = createCanvas(dimensions, dimensions);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, (canvas.width / 2) - (data.width / 2), (canvas.height / 2) - (data.height / 2));
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'square.png' }] });
	}
};
