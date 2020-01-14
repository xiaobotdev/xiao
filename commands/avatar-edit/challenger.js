const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { silhouette } = require('../../util/Canvas');

module.exports = class ChallengerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'challenger',
			aliases: ['challenger-approaching'],
			group: 'avatar-edit',
			memberName: 'challenger',
			description: 'Draws a user\'s avatar over Super Smash Bros.\'s "Challenger Approaching" screen.',
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
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: msg => msg.author
				},
				{
					key: 'silhouetted',
					prompt: 'Should the image be silhouetted?',
					type: 'boolean',
					default: false
				}
			]
		});
	}

	async run(msg, { user, silhouetted }) {
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'challenger.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(silhouetted ? this.silhouetteImage(avatar) : avatar, 484, 98, 256, 256);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'challenger.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	silhouetteImage(image) {
		const canvas = createCanvas(image.width, image.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0);
		silhouette(ctx, 0, 0, image.width, image.height);
		return canvas;
	}
};
