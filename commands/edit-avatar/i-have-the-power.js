const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class IHaveThePowerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'i-have-the-power',
			aliases: ['he-man'],
			group: 'edit-avatar',
			memberName: 'i-have-the-power',
			description: 'Draws a user\'s avatar over He-Man\'s face.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Mattel',
					url: 'https://www.mattel.com/en-us',
					reason: 'Image, Original "He-Man" Show'
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'i-have-the-power.png'));
		const { body } = await request.get(avatarURL);
		const avatar = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.rotate(18.3 * (Math.PI / 180));
		ctx.drawImage(avatar, 332, -125, 175, 175);
		ctx.rotate(-18.3 * (Math.PI / 180));
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'i-have-the-power.png' }] });
	}
};
