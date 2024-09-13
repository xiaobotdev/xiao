const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { silhouette, hasAlpha, centerImagePart } = require('../../util/Canvas');
const games = {
	64: {
		x: 207,
		y: 91,
		maxWidth: 80,
		maxHeight: 123
	},
	melee: {
		x: 447,
		y: 113,
		maxWidth: 181,
		maxHeight: 247
	},
	brawl: {
		x: 321,
		y: 83,
		maxWidth: 140,
		maxHeight: 222
	},
	4: {
		x: 459,
		y: 82,
		maxWidth: 281,
		maxHeight: 294
	},
	ultimate: {
		x: 612,
		y: 80,
		maxWidth: 500,
		maxHeight: 500
	}
};

module.exports = class ChallengerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'challenger',
			aliases: ['challenger-approaching'],
			group: 'edit-meme',
			description: 'Draws an image or a user\'s avatar over Smash Bros.\'s "Challenger Approaching" screen.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'gman5846',
					url: 'https://www.deviantart.com/gman5846',
					reason: 'Melee Image',
					reasonURL: 'https://www.deviantart.com/gman5846/art/SSBM-Challenger-Approaching-Template-861023507'
				},
				{
					name: 'Kevster823',
					url: 'https://www.deviantart.com/kevster823',
					reason: 'Brawl Image',
					reasonURL: 'https://www.deviantart.com/kevster823/art/SSBB-Challenger-Approaching-Template-401524280'
				},
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
					avatarSize: 512,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true })
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
		const img = silhouetted ? this.silhouetteImage(data) : data;
		const { x, y, width, height } = centerImagePart(img, gameData.maxWidth, gameData.maxHeight, gameData.x, gameData.y);
		ctx.drawImage(img, x, y, width, height);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'challenger.png' }] });
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
