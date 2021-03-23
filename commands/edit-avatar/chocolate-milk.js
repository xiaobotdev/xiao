const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class ChocolateMilkCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'chocolate-milk',
			aliases: ['milk', 'sip-milk', 'sip-chocolate-milk', 'choccy', 'sip-choccy'],
			group: 'edit-avatar',
			memberName: 'chocolate-milk',
			description: 'Draws a user\'s avatar holding chocolate milk.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: msg => msg.author
				},
				{
					key: 'direction',
					prompt: 'What direction should the avatar face? Either right or left.',
					type: 'string',
					oneOf: ['left', 'right'],
					default: 'left',
					parse: direction => direction.toLowerCase()
				}
			]
		});
	}

	async run(msg, { user, direction }) {
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'chocolate-milk.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillRect(0, 0, base.width, base.height);
			if (direction === 'right') {
				ctx.translate(base.width, 0);
				ctx.scale(-1, 1);
			}
			ctx.drawImage(avatar, 0, 0, 512, 512);
			if (direction === 'right') ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.drawImage(base, 0, 0);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'chocolate-milk.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
