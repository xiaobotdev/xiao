const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { sepia } = require('../../util/Canvas');

module.exports = class WantedCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wanted',
			aliases: ['wanted-poster'],
			group: 'avatar-edit',
			memberName: 'wanted',
			description: 'Draws a user\'s avatar over a wanted poster.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Tim\'s Printables',
					url: 'https://www.timvandevall.com/',
					reason: 'Image',
					reasonURL: 'https://www.pinterest.com/pin/365002744774849370/'
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
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'wanted.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 150, 360, 430, 430);
			sepia(ctx, 150, 360, 430, 430);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'wanted.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
