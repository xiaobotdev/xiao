const { Command } = require('discord.js-commando');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');

module.exports = class BeautifulCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'beautiful',
			aliases: ['grunkle-stan'],
			group: 'avatar-edit',
			memberName: 'beautiful',
			description: 'Draws a user\'s avatar over Gravity Falls\' "Oh, this? This is beautiful." meme.',
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
			size: 256
		});
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'beautiful.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, base.width, base.height);
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 341, 35, 117, 135);
			ctx.drawImage(avatar, 343, 301, 117, 135);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'beautiful.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
