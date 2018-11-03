const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = class CircleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'circle',
			aliases: ['preview-avatar', 'preview-ava'],
			group: 'image-edit',
			memberName: 'circle',
			description: 'Draws an image or a user\'s avatar as a circle.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'image',
					prompt: 'Which image would you like to edit?',
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const dimensions = data.width <= data.height ? data.width : data.height;
			const canvas = createCanvas(dimensions, dimensions);
			const ctx = canvas.getContext('2d');
			ctx.beginPath();
			ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, 0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();
			ctx.drawImage(data, (canvas.width / 2) - (data.width / 2), (canvas.height / 2) - (data.height / 2));
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'circle.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
