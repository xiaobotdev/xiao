const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class DistractedBoyfriendCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'distracted-boyfriend',
			aliases: ['man-looking-at-other-woman', 'jealous-girlfriend', 'distracted-bf', 'jealous-gf'],
			group: 'edit-meme',
			description: 'Draws three user\'s avatars over the "Distracted Boyfriend" meme.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Antonio Guillem',
					url: 'http://antonioguillem.com/',
					reason: 'Image',
					reasonURL: 'https://www.istockphoto.com/photo/gm493656728-77018851'
				}
			],
			args: [
				{
					key: 'otherGirl',
					label: 'other girl',
					type: 'user'
				},
				{
					key: 'girlfriend',
					type: 'user'
				},
				{
					key: 'boyfriend',
					type: 'user'
				}
			]
		});
	}

	async run(msg, { otherGirl, girlfriend, boyfriend }) {
		const boyfriendAvatarURL = boyfriend.displayAvatarURL({ extension: 'png', size: 256, forceStatic: true });
		const girlfriendAvatarURL = girlfriend.displayAvatarURL({ extension: 'png', size: 256, forceStatic: true });
		const otherGirlAvatarURL = otherGirl.displayAvatarURL({ extension: 'png', size: 256, forceStatic: true });
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'distracted-boyfriend.png'));
		const boyfriendAvatarData = await request.get(boyfriendAvatarURL);
		const boyfriendAvatar = await loadImage(boyfriendAvatarData.body);
		const girlfriendAvatarData = await request.get(girlfriendAvatarURL);
		const girlfriendAvatar = await loadImage(girlfriendAvatarData.body);
		const otherGirlAvatarData = await request.get(otherGirlAvatarURL);
		const otherGirlAvatar = await loadImage(otherGirlAvatarData.body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.rotate(-18.06 * (Math.PI / 180));
		ctx.drawImage(boyfriendAvatar, 290, 165, 125, 125);
		ctx.rotate(18.06 * (Math.PI / 180));
		ctx.rotate(3.11 * (Math.PI / 180));
		ctx.drawImage(girlfriendAvatar, 539, 67, 100, 125);
		ctx.rotate(-3.11 * (Math.PI / 180));
		ctx.drawImage(otherGirlAvatar, 120, 96, 175, 175);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'distracted-boyfriend.png' }] });
	}
};
