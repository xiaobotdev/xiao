const { Command } = require('discord.js-commando');
const { createCanvas, loadImage, registerFont } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class DemotivationalPosterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'demotivational-poster',
			aliases: ['demotivational'],
			group: 'avatar-edit',
			memberName: 'demotivational-poster',
			description: 'Draws a user\'s avatar and the text you specify as a demotivational poster.',
			throttling: {
				usages: 1,
				duration: 15
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'title',
					prompt: 'What should the title of the poster be?',
					type: 'string',
					parse: title => title.toUpperCase()
				},
				{
					key: 'text',
					prompt: 'What should the text of the poster be?',
					type: 'string'
				},
				{
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: ''
				}
			]
		});
	}

	async run(msg, { title, text, user }) {
		if (!user) user = msg.author;
		const avatarURL = user.displayAvatarURL({
			format: 'png',
			size: 1024
		});
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'demotivational-poster.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, base.width, base.height);
			ctx.drawImage(avatar, 68, -57, 612, 612);
			ctx.drawImage(base, 0, 0);
			ctx.textAlign = 'center';
			ctx.font = '60px Noto';
			ctx.fillStyle = 'aquamarine';
			ctx.fillText(title, 375, 518);
			ctx.font = '27px Noto';
			ctx.fillStyle = 'white';
			ctx.fillText(text, 375, 565);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'demotivational-poster.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
