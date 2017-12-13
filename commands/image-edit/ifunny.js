const { Command } = require('discord.js-commando');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');

module.exports = class IfunnyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ifunny',
			group: 'image-edit',
			memberName: 'ifunny',
			description: 'Draws an image with the iFunny logo.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const base = loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'ifunny.png'));
			const { body } = await snekfetch.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(data, 0, 0);
			ctx.fillStyle = '#181619';
			ctx.fillRect(0, canvas.height - data.height, canvas.width, data.height);
			ctx.drawImage(base, canvas.width - data.width, canvas.height - data.height);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'ifunny.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
