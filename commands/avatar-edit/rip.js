const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { greyscale } = require('../../util/Canvas');

module.exports = class RipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rip',
			aliases: ['grave', 'grave-stone'],
			group: 'avatar-edit',
			memberName: 'rip',
			description: 'Draws a user\'s avatar over a gravestone.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'vician',
					url: 'https://www.123rf.com/profile_vician'
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
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'rip.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 194, 399, 500, 500);
			greyscale(ctx, 194, 399, 500, 500);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'rip.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
