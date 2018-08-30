const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class ThisIsWorthlessCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'this-is-worthless',
			aliases: ['worthless'],
			group: 'avatar-edit',
			memberName: 'this-is-worthless',
			description: 'Draws a user\'s avatar over Gravity Falls\' "Oh, this? This is worthless." meme.',
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
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'this-is-worthless.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.rotate(6 * (Math.PI / 180));
			ctx.drawImage(avatar, 496, 183, 400, 400);
			ctx.rotate(-6 * (Math.PI / 180));
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'this-is-worthless.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
