const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { drawImageWithTint } = require('../../util/Canvas');

module.exports = class FireFrameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fire-frame',
			aliases: ['hell-frame', 'burn-frame', 'flames-frame'],
			group: 'edit-image',
			memberName: 'fire-frame',
			description: 'Draws a fiery border over an image or a user\'s avatar.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'susi1959',
					url: 'https://en.picmix.com/profile/susi1959',
					reason: 'Image',
					reasonURL: 'https://en.picmix.com/stamp/FIRE-FRAME-ORANGE-cadre-feu-orange-360274'
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
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'fire-frame.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			drawImageWithTint(ctx, data, '#fc671e', 0, 0, data.width, data.height);
			ctx.drawImage(base, 0, 0, data.width, data.height);
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'fire-frame.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
