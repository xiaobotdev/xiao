const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const request = require('node-superfetch');
const path = require('path');
const { streamToArray } = require('../../util/Util');
const { distort } = require('../../util/Canvas');
const frameCount = 249;

module.exports = class MatrixCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'matrix',
			aliases: ['matrix-rain', 'the-matrix'],
			group: 'edit-avatar',
			memberName: 'matrix',
			description: 'Draws Matrix rain over a user\'s avatar.',
			throttling: {
				usages: 1,
				duration: 120
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Wikipedia',
					url: 'https://en.wikipedia.org/wiki/Main_Page',
					reason: 'Images',
					reasonURL: 'https://en.wikipedia.org/wiki/File:Digital_rain_animation_small_letters_shine.gif'
				},
				{
					name: 'Warner Bros.',
					url: 'https://www.warnerbros.com/',
					reason: '"The Matrix" Original Movie',
					reasonURL: 'https://www.whatisthematrix.com/'
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
		const { body } = await request.get(avatarURL);
		const avatar = await loadImage(body);
		const encoder = new GIFEncoder(avatar.width, avatar.height);
		const canvas = createCanvas(avatar.width, avatar.height);
		const ctx = canvas.getContext('2d');
		const stream = encoder.createReadStream();
		encoder.start();
		encoder.setRepeat(0);
		encoder.setDelay(0);
		encoder.setQuality(200);
		for (let i = 0; i < frameCount; i++) {
			const frame = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'matrix', `frame-${i}.gif`));
			const ratio = frame.width / frame.height;
			const height = Math.round(avatar.width / ratio);
			ctx.drawImage(avatar, 0, 0);
			distort(ctx, 20, 0, 0, avatar.width, avatar.height, 5);
			ctx.drawImage(frame, 0, avatar.height - height, avatar.width, height);
			encoder.addFrame(ctx);
		}
		encoder.finish();
		const buffer = await streamToArray(stream);
		return msg.say({ files: [{ attachment: Buffer.concat(buffer), name: 'matrix.gif' }] });
	}
};
