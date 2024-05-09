const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const types = ['x', 'y', 'both'];

module.exports = class MirrorCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mirror',
			group: 'edit-image',
			memberName: 'mirror',
			description: 'Draws an image or a user\'s avatar but mirrored on the X/Y axis (or both).',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			args: [
				{
					key: 'type',
					type: 'string',
					oneOf: types,
					parse: type => type.toLowerCase()
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 512,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { type, image }) {
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		if (type === 'x') {
			ctx.translate(canvas.width, 0);
			ctx.scale(-1, 1);
		} else if (type === 'y') {
			ctx.translate(0, canvas.height);
			ctx.scale(1, -1);
		} else if (type === 'both') {
			ctx.translate(canvas.width, canvas.height);
			ctx.scale(-1, -1);
		}
		ctx.drawImage(data, 0, 0);
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'mirror.png' }] });
	}
};
