const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { drawImageWithTint } = require('../../util/Canvas');

module.exports = class HeLivesInYouCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'he-lives-in-you',
			aliases: ['mufasa', 'simba'],
			group: 'edit-avatar',
			memberName: 'he-lives-in-you',
			description: 'Draws a user\'s avatar over Simba from The Lion King\'s reflection.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Disney',
					url: 'https://www.disney.com/',
					reason: 'Image, Original "The Lion King" Movie',
					reasonURL: 'https://movies.disney.com/the-lion-king'
				}
			],
			args: [
				{
					key: 'user',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { user }) {
		const avatarURL = user.displayAvatarURL({ extension: 'png', size: 256 });
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'he-lives-in-you.png'));
		const { body } = await request.get(avatarURL);
		const avatar = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.rotate(-24 * (Math.PI / 180));
		drawImageWithTint(ctx, avatar, '#00115d', 75, 160, 130, 150);
		ctx.rotate(24 * (Math.PI / 180));
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'he-lives-in-you.png' }] });
	}
};
