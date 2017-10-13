const { Command } = require('discord.js-commando');
const { createCanvas, loadImage, registerFont } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');
const { version } = require('../../package');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class CardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'card',
			aliases: ['discord-card'],
			group: 'avatar-edit',
			memberName: 'card',
			description: 'Draws a trading card of random rarity based on a user\'s profile.',
			throttling: {
				usages: 1,
				duration: 15
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: ''
				}
			]
		});
	}

	async run(msg, { user }) {
		if (!user) user = msg.author;
		const avatarURL = user.displayAvatarURL({
			format: 'png',
			size: 512
		});
		try {
			const cardID = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
			let rarity;
			if (cardID < 5000) rarity = 'C';
			else if (cardID < 9000) rarity = 'U';
			else rarity = 'R';
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'card.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, 390, 544);
			ctx.drawImage(avatar, 11, 11, 370, 370);
			ctx.drawImage(base, 0, 0);
			ctx.font = '18px Noto';
			ctx.fillStyle = 'black';
			ctx.fillText(user.username, 30, 62);
			ctx.fillText('Discord Join Date:', 148, 400);
			ctx.fillText(user.createdAt.toDateString(), 148, 420);
			ctx.fillText(rarity, 73, 411);
			ctx.fillText(cardID, 60, 457);
			ctx.fillText(version.split('.')[0], 68, 502);
			ctx.font = '14px Noto';
			ctx.fillText(user.id, 30, 355);
			ctx.fillText(`#${user.discriminator}`, 313, 355);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'card.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
