const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const request = require('node-superfetch');
const path = require('path');
const { streamToArray, reactIfAble } = require('../../util/Util');
const { distort } = require('../../util/Canvas');
const { LOADING_EMOJI_ID, SUCCESS_EMOJI_ID } = process.env;
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
		const avatarURL = user.displayAvatarURL({ extension: 'png', size: 256 });
		await reactIfAble(msg, msg.author, LOADING_EMOJI_ID, '💬');
		const { body } = await request.get(avatarURL);
		const avatar = await loadImage(body);
		const encoder = new GIFEncoder(avatar.width, avatar.height);
		const canvas = createCanvas(avatar.width, avatar.height);
		const ctx = canvas.getContext('2d');
		const stream = encoder.createReadStream();
		encoder.start();
		encoder.setRepeat(0);
		encoder.setDelay(0);
		encoder.setQuality(10);
		const distortedCanvas = createCanvas(avatar.width, avatar.height);
		const distortedCtx = distortedCanvas.getContext('2d');
		ctx.drawImage(avatar, 0, 0);
		distort(distortedCtx, 20, 0, 0, avatar.width, avatar.height, 5);
		for (let i = 0; i < frameCount; i++) {
			const frame = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'matrix', `frame-${i}.gif`));
			const ratio = frame.width / frame.height;
			const width = Math.round(avatar.height / ratio);
			ctx.drawImage(distortedCanvas, 0, 0);
			ctx.drawImage(frame, avatar.width - width, 0, width, avatar.height);
			encoder.addFrame(ctx);
		}
		encoder.finish();
		const buffer = await streamToArray(stream);
		reactIfAble(msg, msg.author, SUCCESS_EMOJI_ID, '✅');
		return msg.say({ files: [{ attachment: Buffer.concat(buffer), name: 'matrix.gif' }] });
	}
};
