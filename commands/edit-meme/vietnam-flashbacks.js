const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class VietnamFlashbacksCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'vietnam-flashbacks',
			aliases: ['nam-flashbacks', 'vietnam', 'nam'],
			group: 'edit-meme',
			memberName: 'vietnam-flashbacks',
			description: 'Edits Vietnam flashbacks behind an image or a user\'s avatar.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Horst Faas',
					url: 'https://en.wikipedia.org/wiki/Horst_Faas',
					reason: 'Image'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 2048 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'vietnam-flashbacks.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		const ratio = base.width / base.height;
		const width = Math.round(data.height * ratio);
		ctx.drawImage(base, (data.width / 2) - (width / 2), 0, width, data.height);
		ctx.globalAlpha = 0.675;
		ctx.drawImage(data, 0, 0);
		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
		return msg.say({ files: [{ attachment, name: 'vietnam-flashbacks.png' }] });
	}
};
