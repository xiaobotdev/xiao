const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class BeautifulCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'beautiful',
			aliases: ['this-is-beautiful', 'grunkle-stan'],
			group: 'edit-meme',
			memberName: 'beautiful',
			description: 'Draws a user\'s avatar over Gravity Falls\' "Oh, this? This is beautiful." meme.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Disney',
					url: 'https://www.disney.com/',
					reason: 'Original "Gravity Falls" Show',
					reasonURL: 'https://disneynow.com/shows/gravity-falls'
				},
				{
					name: 'Tatsumaki',
					url: 'https://tatsumaki.xyz/',
					reason: 'Image'
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
		const avatarURL = user.displayAvatarURL({ extension: 'png', size: 128 });
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'beautiful.png'));
		const { body } = await request.get(avatarURL);
		const avatar = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, base.width, base.height);
		ctx.drawImage(avatar, 249, 24, 105, 105);
		ctx.drawImage(avatar, 249, 223, 105, 105);
		ctx.drawImage(base, 0, 0);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'beautiful.png' }] });
	}
};
