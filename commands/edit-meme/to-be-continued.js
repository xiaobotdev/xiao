const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { drawImageWithTint } = require('../../util/Canvas');

module.exports = class ToBeContinuedCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'to-be-continued',
			aliases: ['tbc', 'つづく', 'tsudzuku', 'tsuzuku'],
			group: 'edit-meme',
			memberName: 'to-be-continued',
			description: 'Draws an image with the "To Be Continued..." arrow.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'JoJo\'s Bizzare Adventure',
					url: 'http://www.araki-jojo.com/',
					reason: 'Original Anime'
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'to-be-continued.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		drawImageWithTint(ctx, data, '#704214', 0, 0, data.width, data.height);
		const ratio = base.width / base.height;
		const width = canvas.width / 2;
		const height = Math.round(width / ratio);
		ctx.drawImage(base, 0, canvas.height - height, width, height);
		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
		return msg.say({ files: [{ attachment, name: 'to-be-continued.png' }] });
	}
};
