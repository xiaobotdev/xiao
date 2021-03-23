const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class WorseThanHitlerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'worse-than-hitler',
			aliases: ['hitler'],
			group: 'edit-meme',
			memberName: 'worse-than-hitler',
			description: 'Draws a user\'s avatar over Family Guy\'s "Worse Than Hitler" meme.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: '20th Century Fox',
					url: 'https://www.foxmovies.com/',
					reason: 'Image, Original "Family Guy" Show',
					reasonURL: 'https://www.fox.com/family-guy/'
				}
			],
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { user }) {
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'worse-than-hitler.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 47, 42, 140, 140);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'worse-than-hitler.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
