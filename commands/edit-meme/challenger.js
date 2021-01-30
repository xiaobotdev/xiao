const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { silhouette, hasAlpha, centerImagePart } = require('../../util/Canvas');

module.exports = class ChallengerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'challenger',
			aliases: ['challenger-approaching'],
			group: 'edit-meme',
			memberName: 'challenger',
			description: 'Draws an image or a user\'s avatar over Smash Bros.\'s "Challenger Approaching" screen.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Jack The Awesomeness Gamer',
					url: 'https://www.youtube.com/channel/UCIeA23B91hAeR1UuC2VDSdQ',
					reason: 'Image',
					reasonURL: 'https://www.youtube.com/watch?v=3FebRrXg0bk'
				},
				{
					name: 'Nintendo',
					url: 'https://www.nintendo.com/',
					reason: 'Original "Super Smash Bros." Game',
					reasonURL: 'https://www.smashbros.com/en_US/index.html'
				}
			],
			args: [
				{
					key: 'silhouetted',
					prompt: 'Should the image be silhouetted?',
					type: 'boolean',
					default: true
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 256 })
				}
			]
		});
	}

	async run(msg, { image, silhouetted }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'challenger.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			const { x, y, width, height } = centerImagePart(data, 256, 256, 484, 98);
			ctx.drawImage(silhouetted ? this.silhouetteImage(data) : data, x, y, width, height);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'challenger.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	silhouetteImage(image) {
		if (!hasAlpha(image)) return image;
		const canvas = createCanvas(image.width, image.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0);
		silhouette(ctx, 0, 0, image.width, image.height);
		return canvas;
	}
};
