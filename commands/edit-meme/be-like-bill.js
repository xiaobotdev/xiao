const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');
const { wrapText, fillTextWithBreaks } = require('../../util/Canvas');
const texts = require('../../assets/json/be-like-bill');

module.exports = class BeLikeBillCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'be-like-bill',
			aliases: ['be-like'],
			group: 'edit-meme',
			description: 'Sends a "Be Like Bill" meme with the name of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'gautamkrishnar',
					url: 'https://github.com/gautamkrishnar/',
					reason: 'Image',
					reasonURL: 'https://github.com/gautamkrishnar/Be-Like-Bill'
				},
				{
					name: 'Monotype',
					url: 'https://www.monotype.com/',
					reason: 'Arial Font',
					reasonURL: 'https://catalog.monotype.com/family/monotype/arial'
				}
			],
			args: [
				{
					key: 'name',
					type: 'string',
					default: 'Bill',
					max: 20
				}
			]
		});
	}

	async run(msg, { name }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'be-like-bill.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = this.client.fonts.get('arialbd.ttf').toCanvasString(23);
		const text = wrapText(ctx, texts[Math.floor(Math.random() * texts.length)].replaceAll('{{name}}', name), 569);
		fillTextWithBreaks(ctx, `This is ${name}.\n\n${text.join('\n')}\n\n${name} is smart.\nBe like ${name}.`, 31, 80);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'be-like-bill.png' }] });
	}
};
