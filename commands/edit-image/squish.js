const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = class SquishCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'squish',
			group: 'edit-image',
			memberName: 'squish',
			description: 'Draws an image or a user\'s avatar but squished across the X or Y axis.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'axis',
					prompt: 'What axis do you want to squish?',
					type: 'string',
					oneOf: ['x', 'y'],
					parse: axis => axis.toLowerCase()
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { axis, image }) {
		const flipX = axis === 'x';
		const flipY = axis === 'y';
		try {
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(flipX ? data.width / 2 : data.width, flipY ? data.height / 2 : data.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(data, 0, 0, canvas.width, canvas.height);
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'squish.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
