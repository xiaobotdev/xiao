const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { silhouette, hasAlpha, centerImagePart } = require('../../util/Canvas');
const games = {
	ultimate: {
		x: 645,
		y: 132,
		size: 400
	},
	4: {
		x: 484,
		y: 98,
		size: 256
	}
};

module.exports = class ChallengerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'challenger',
			aliases: ['challenger-approaching'],
			group: 'edit-meme',
			memberName: 'challenger',
			description: 'Draws an image or a user\'s avatar over Smash Bros.\'s "Challenger Approaching" screen.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Jack The Awesomeness Gamer',
					url: 'https://www.youtube.com/channel/UCIeA23B91hAeR1UuC2VDSdQ',
					reason: 'Smash 4 Image',
					reasonURL: 'https://www.youtube.com/watch?v=3FebRrXg0bk'
				},
				{
					name: 'MatthewThePrep',
					url: 'https://www.deviantart.com/matthewtheprep',
					reason: 'Ultimate Image',
					reasonURL: 'https://www.deviantart.com/matthewtheprep/art/SSBU-Challenger-Approaching-meme-template-800422972'
				},
				{
					name: 'Nintendo',
					url: 'https://www.nintendo.com/',
					reason: 'Original "Super Smash Bros." Game',
					reasonURL: 'https://www.smashbros.com/en_US/index.html'
				}
			],
			flags: [
				{
					key: 'show',
					description: 'Does not silhouette the image.'
				},
				{
					key: 's',
					description: 'Alias for show.'
				}
			],
			args: [
				{
					key: 'game',
					type: 'string',
					oneOf: Object.keys(games),
					parse: game => game.toLowerCase()
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 256 })
				}
			]
		});
	}

	async run(msg, { game, image, flags }) {
		const silhouetted = !(flags.show || flags.s);
		const gameData = games[game];
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'challenger', `${game}.png`));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		const { x, y, width, height } = centerImagePart(data, gameData.size, gameData.size, gameData.x, gameData.y);
		ctx.drawImage(silhouetted ? this.silhouetteImage(data) : data, x, y, width, height);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'challenger.png' }] });
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
