const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const GIFEncoder = require('gifencoder');
const request = require('node-superfetch');
const path = require('path');
const { drawImageWithTint } = require('../../util/Canvas');
const coord1 = [-25, -33, -42, -14];
const coord2 = [-25, -13, -34, -10];

module.exports = class TriggeredCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'triggered',
			aliases: ['trigger'],
			group: 'edit-avatar',
			memberName: 'triggered',
			description: 'Draws a user\'s avatar over the "Triggered" meme.',
			throttling: {
				usages: 2,
				duration: 30
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'NotAWeebDev',
					url: 'https://github.com/NotAWeebDev/',
					reason: 'Image',
					// eslint-disable-next-line max-len
					reasonURL: 'https://github.com/NotAWeebDev/Misaki/blob/2e44f9efb467028dcbae5a2c9f836d2e99860b85/assets/images/plate_triggered.png'
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'triggered.png'));
		const { body } = await request.get(avatarURL);
		const avatar = await loadImage(body);
		const encoder = new GIFEncoder(base.width, base.width);
		const canvas = createCanvas(base.width, base.width);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, base.width, base.width);
		encoder.start();
		encoder.setRepeat(0);
		encoder.setDelay(50);
		encoder.setQuality(20);
		for (let i = 0; i < 4; i++) {
			drawImageWithTint(ctx, avatar, 'red', coord1[i], coord2[i], 300, 300);
			ctx.drawImage(base, 0, 218, 256, 38);
			encoder.addFrame(ctx);
		}
		encoder.finish();
		const attachment = encoder.out.getData();
		return msg.say({ files: [{ attachment, name: 'triggered.gif' }] });
	}
};
