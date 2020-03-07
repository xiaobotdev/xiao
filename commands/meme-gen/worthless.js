const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class WorthlessCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'worthless',
			aliases: ['this-is-worthless'],
			group: 'meme-gen',
			memberName: 'worthless',
			description: 'Draws a user\'s avatar over Gravity Falls\' "Oh, this? This is worthless." meme.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Disney',
					url: 'https://www.disney.com/',
					reason: 'Original "Gravity Falls" Show',
					reasonURL: 'https://disneynow.com/shows/gravity-falls'
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
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'worthless.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.rotate(6 * (Math.PI / 180));
			ctx.drawImage(avatar, 496, 183, 400, 400);
			ctx.rotate(-6 * (Math.PI / 180));
			ctx.translate(canvas.width / 2, canvas.height / 2);
			ctx.rotate(160 * (Math.PI / 180));
			ctx.translate(-(canvas.width / 2), -(canvas.height / 2));
			ctx.drawImage(avatar, 625, 55, 75, 75);
			ctx.rotate(-160 * (Math.PI / 180));
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'worthless.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
