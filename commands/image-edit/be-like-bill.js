const { Command } = require('discord.js-commando');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { stripIndents } = require('common-tags');
const path = require('path');
const texts = require('../../assets/json/be-like-bill');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class BeLikeBillCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'be-like-bill',
			aliases: ['be-like'],
			group: 'image-edit',
			memberName: 'be-like-bill',
			description: 'Sends a "Be Like Bill" meme with the name of your choice.',
			throttling: {
				usages: 1,
				duration: 15
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'name',
					prompt: 'What should the name on the meme be?',
					type: 'string',
					default: 'Bill'
				}
			]
		});
	}

	async run(msg, { name }) {
		const canvas = createCanvas(800, 420);
		const ctx = canvas.getContext('2d');
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'be-like-bill.png'));
		ctx.drawImage(base, 0, 0);
		ctx.font = '23px Noto';
		const text = stripIndents`
			This is ${name}.

			${texts[Math.floor(Math.random() * texts.length)].replace(/{{name}}/gi, name)}

			${name} is smart.
			Be like ${name}.
		`;
		ctx.fillText(text, 31, 80);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'be-like-bill.png' }] });
	}
};

