const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class GlassShatterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'glass-shatter',
			aliases: ['shatter', 'glass'],
			group: 'edit-image',
			memberName: 'glass-shatter',
			description: 'Draws an image or a user\'s avatar with a glass shatter in front of it.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Platinum Designz',
					url: 'http://store.platinumdesignz.com/',
					reason: 'Image',
					reasonURL: 'https://www.jing.fm/iclipt/u2q8u2a9o0t4i1q8/'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'glass-shatter.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		ctx.drawImage(base, 0, 0, data.width, data.height);
		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
		return msg.say({ files: [{ attachment, name: 'glass-shatter.png' }] });
	}
};
