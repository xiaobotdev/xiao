const { Command } = require('discord.js-commando');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Minecraftia.ttf'), { family: 'Minecraftia' });

module.exports = class AchievementCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'achievement',
			aliases: ['minecraft-achievement'],
			group: 'image-edit',
			memberName: 'achievement',
			description: 'Sends a Minecraft achievement with the text of your choice.',
			throttling: {
				usages: 1,
				duration: 15
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'text',
					prompt: 'What should the text of the achievement be?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'achievement.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = '17px Minecraftia';
		ctx.fillStyle = '#ffff00';
		ctx.fillText('Achievement Get!', 60, 27);
		let shorten;
		if (ctx.measureText(text).width > 230) shorten = true;
		while (ctx.measureText(text).width > 230) text = text.substr(0, text.length - 1);
		ctx.fillStyle = '#ffffff';
		ctx.fillText(shorten ? `${text}...` : text, 60, 49);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'achievement.png' }] });
	}
};

