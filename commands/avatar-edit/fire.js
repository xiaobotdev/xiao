const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { drawImageWithTint } = require('../../util/Canvas');

module.exports = class FireCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fire',
			aliases: ['flame', 'hell'],
			group: 'avatar-edit',
			memberName: 'fire',
			description: 'Draws a fiery border over a user\'s avatar.',
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
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'fire.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(avatar.width, avatar.height);
			const ctx = canvas.getContext('2d');
			drawImageWithTint(ctx, avatar, '#fc671e', 0, 0, avatar.width, avatar.height);
			ctx.drawImage(base, 0, 0, avatar.width, avatar.height);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'fire.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
