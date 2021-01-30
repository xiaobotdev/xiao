const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { fishEye } = require('../../util/Canvas');

module.exports = class FishEyeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fish-eye',
			aliases: ['bulge'],
			group: 'edit-image',
			memberName: 'fish-eye',
			description: 'Draws an image or a user\'s avatar but with a fish-eye lens.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Hackyon',
					url: 'http://www.hackyon.com/playground/fisheye/',
					reason: 'Fish-Eye Code'
				}
			],
			args: [
				{
					key: 'level',
					prompt: 'What level of distortion would you like to use?',
					type: 'integer',
					min: 1,
					max: 100
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { level, image }) {
		try {
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(data, 0, 0);
			fishEye(ctx, level, 0, 0, data.width, data.height);
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'fish-eye.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
