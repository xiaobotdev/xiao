const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class LegoIconCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lego-icon',
			aliases: ['icon-lego', 'lego-star-wars', 'lego-sw'],
			group: 'edit-image',
			description: 'Edits an image or avatar onto a character icon from LEGO Star Wars.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'LEGO',
					url: 'https://www.lego.com/en-us',
					reason: 'Original Design',
					reasonURL: 'https://store.steampowered.com/app/32440/LEGO_Star_Wars__The_Complete_Saga/'
				},
				{
					name: 'u/PowderedShmegma',
					url: 'https://www.reddit.com/user/PowderedShmegma/',
					reason: 'Image',
					reasonURL: 'https://www.reddit.com/r/legostarwars/comments/eheb76/lego_sw_character_icon_template/'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 512,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'lego-icon.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.beginPath();
		ctx.arc(base.width / 2, base.height / 2, 764 / 2, 0, Math.PI * 2);
		ctx.closePath();
		ctx.clip();
		const height = 764 / data.width;
		ctx.drawImage(data, (base.width / 2) - (764 / 2), (base.height / 2) - (764 / 2), 764, data.height * height);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'lego-icon.png' }] });
	}
};
