const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { drawImageWithTint } = require('../../util/Canvas');

module.exports = class HeartsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hearts',
			aliases: ['heart'],
			group: 'edit-avatar',
			memberName: 'hearts',
			description: 'Draws hearts around a user\'s avatar.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Jessica Knable',
					url: 'https://picsart.com/u/jessicaknable',
					reason: 'Image',
					reasonURL: 'https://picsart.com/i/sticker-hearts-heart-borders-frames-round-frame-border-love-263412201018212'
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
		const avatarURL = user.displayAvatarURL({ extension: 'png', size: 512 });
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'hearts.png'));
		const { body } = await request.get(avatarURL);
		const avatar = await loadImage(body);
		const canvas = createCanvas(avatar.width, avatar.height);
		const ctx = canvas.getContext('2d');
		drawImageWithTint(ctx, avatar, 'deeppink', 0, 0, avatar.width, avatar.height);
		ctx.drawImage(base, 0, 0, avatar.width, avatar.height);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'hearts.png' }] });
	}
};
