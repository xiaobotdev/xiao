const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class ThisIsBeautifulCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'this-is-beautiful',
			aliases: ['beautiful', 'grunkle-stan'],
			group: 'avatar-edit',
			memberName: 'this-is-beautiful',
			description: 'Draws a user\'s avatar over Gravity Falls\' "Oh, this? This is beautiful." meme.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
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
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 128 });
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'this-is-beautiful.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, base.width, base.height);
			ctx.drawImage(avatar, 249, 24, 105, 105);
			ctx.drawImage(avatar, 249, 223, 105, 105);
			ctx.drawImage(base, 0, 0);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'this-is-beautiful.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
