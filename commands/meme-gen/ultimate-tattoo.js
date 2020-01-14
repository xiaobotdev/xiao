const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class UltimateTattooCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ultimate-tattoo',
			aliases: ['the-ultimate-tattoo', 'tattoo'],
			group: 'meme-gen',
			memberName: 'ultimate-tattoo',
			description: 'Draws a user\'s avatar as "The Ultimate Tattoo".',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Deathbulge',
					url: 'http://deathbulge.com/comics',
					reason: 'Image',
					reasonURL: 'http://deathbulge.com/comics/114'
				},
				{
					name: 'YorkAARGH',
					url: 'https://github.com/YorkAARGH',
					reason: 'Concept'
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
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'ultimate-tattoo.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.rotate(-10 * (Math.PI / 180));
			ctx.drawImage(avatar, 84, 690, 300, 300);
			ctx.rotate(10 * (Math.PI / 180));
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'ultimate-tattoo.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
