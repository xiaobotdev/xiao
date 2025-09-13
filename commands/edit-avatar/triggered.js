const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { GifEncoder } = require('@skyra/gifenc');
const request = require('node-superfetch');
const { buffer } = require('node:stream/consumers');
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
			description: 'Draws a user\'s avatar over the "Triggered" meme.',
			throttling: {
				usages: 2,
				duration: 30
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
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
		const avatarURL = user.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'triggered.png'));
		const { body } = await request.get(avatarURL);
		const avatar = await loadImage(body);
		const encoder = new GifEncoder(base.width, base.width);
		const stream = encoder.createReadStream();
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
		const attachment = await buffer(stream);
		return msg.say({ files: [{ attachment, name: 'triggered.gif' }] });
	}
};
