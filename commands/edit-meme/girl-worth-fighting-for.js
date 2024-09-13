const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class GirlWorthFightingForCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'girl-worth-fighting-for',
			aliases: ['a-girl-worth-fighting-for', 'ling'],
			group: 'edit-meme',
			description: 'Draws an image or a user\'s avatar as the object of Ling\'s affection.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Disney',
					url: 'https://www.disney.com/',
					reason: 'Original "Mulan" Movie',
					reasonURL: 'https://movies.disney.com/mulan'
				},
				{
					name: 'u/SupremeMemesXD',
					url: 'https://www.reddit.com/user/SupremeMemesXD/',
					reason: 'Image',
					reasonURL: 'https://www.reddit.com/r/MemeTemplatesOfficial/comments/8h39vi/girl_worth_fighting_for_template/'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 256,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 256, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'girl-worth-fighting-for.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		const { x, y, width, height } = centerImagePart(data, 150, 150, 380, 511);
		ctx.drawImage(data, x, y, width, height);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'girl-worth-fighting-for.png' }] });
	}
};
