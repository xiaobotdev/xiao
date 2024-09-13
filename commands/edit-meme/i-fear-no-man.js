const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class IFearNoManCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'i-fear-no-man',
			aliases: ['i-fear-no', 'i-fear', 'it-scares-me'],
			group: 'edit-meme',
			description: 'Sends a "I fear no man" meme with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Valve',
					url: 'https://www.valvesoftware.com/en/',
					reasonURL: 'https://www.teamfortress.com/',
					reason: 'Image, Original "Team Fortress 2" Game'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 256,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 256, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'i-fear-no-man.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		const { x, y, width, height } = centerImagePart(data, 169, 169, 167, 330);
		ctx.drawImage(data, x, y, width, height);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'i-fear-no-man.png' }] });
	}
};
