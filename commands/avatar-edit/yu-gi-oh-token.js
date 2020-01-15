const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class YuGiOhTokenCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yu-gi-oh-token',
			aliases: ['ygo-token'],
			group: 'avatar-edit',
			memberName: 'yu-gi-oh-token',
			description: 'Draws a user\'s avatar over a blank Yu-Gi-Oh! Token card.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Konami',
					url: 'https://www.konami.com/en/',
					reason: 'Image, Original "Yu-Gi-Oh!" Game',
					reasonURL: 'https://www.yugioh-card.com/en/'
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
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'yu-gi-oh-token.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, base.width, base.height);
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 45, 102, 293, 294);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'yu-gi-oh-token.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
