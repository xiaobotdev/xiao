const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { delay } = require('../../util/Util');

module.exports = class CatchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'catch',
			aliases: ['everyone-caught-is', 'everyone-caught-is-a'],
			group: 'edit-meme',
			memberName: 'catch',
			description: 'Catch users, revealing who is something.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				}
			],
			args: [
				{
					key: 'is',
					type: 'string',
					max: 15
				},
				{
					key: 'time',
					type: 'integer',
					max: 60,
					min: 1,
					default: 30
				}
			]
		});
	}

	async run(msg, { is, time }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'catch', 'part-2.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textBaseline = 'top';
		ctx.fillStyle = 'red';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(25);
		ctx.fillText('EVERYONE CAUGHT IS', 18, 165);
		ctx.textAlign = 'center';
		ctx.fillText(is.toUpperCase(), 163, 202);
		await msg.channel.send({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'catch', 'part-1.png')] });
		await delay(time * 1000);
		return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'part-2.png' }] });
	}
};
