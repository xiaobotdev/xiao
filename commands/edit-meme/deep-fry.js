const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { desaturate, contrast } = require('../../util/Canvas');

module.exports = class DeepFryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'deep-fry',
			group: 'edit-meme',
			memberName: 'deep-fry',
			description: 'Draws an image or a user\'s avatar but deep-fried.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
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
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(data, 0, 0);
			desaturate(ctx, -20, 0, 0, data.width, data.height);
			contrast(ctx, 0, 0, data.width, data.height);
			const attachment = canvas.toBuffer('image/jpeg', { quality: 0.2 });
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'deep-fry.jpeg' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
