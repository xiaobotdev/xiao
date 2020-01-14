const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class BobRossCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bob-ross',
			aliases: ['ross'],
			group: 'avatar-edit',
			memberName: 'bob-ross',
			description: 'Draws a user\'s avatar over Bob Ross\' canvas.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Know Your Meme',
					url: 'https://knowyourmeme.com/',
					reason: 'Image',
					reasonURL: 'https://knowyourmeme.com/photos/1160348'
				},
				{
					name: 'Bob Ross',
					url: 'https://www.bobross.com/',
					reason: 'Himself'
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
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'bob-ross.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, base.width, base.height);
			ctx.drawImage(avatar, 15, 20, 440, 440);
			ctx.drawImage(base, 0, 0);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'bob-ross.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
