const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class DexterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dexter',
			group: 'edit-image',
			memberName: 'dexter',
			description: 'Draws an image or a user\'s avatar over the screen of Dexter from Pokémon.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Pokémon',
					url: 'https://www.pokemon.com/us/',
					reason: 'Image, Original Anime'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 256 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'dexter.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.rotate(-11 * (Math.PI / 180));
		const { x, y, width, height } = centerImagePart(data, 225, 225, 234, 274);
		ctx.drawImage(data, x, y, width, height);
		ctx.rotate(11 * (Math.PI / 180));
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'dexter.png' }] });
	}
};
