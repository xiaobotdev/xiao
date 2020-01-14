const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class LookWhatKarenHaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'look-what-karen-have',
			aliases: ['look-at-what-karen-has', 'look-what-karen-has'],
			group: 'avatar-edit',
			memberName: 'look-what-karen-have',
			description: 'Draws a user\'s avatar over Karen\'s piece of paper.',
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
					reasonURL: 'https://knowyourmeme.com/photos/1047091-kin-iro-mosaic-kinmoza'
				},
				{
					name: 'KINMOZA!',
					url: 'http://www.kinmosa.com/',
					reason: 'Original Anime'
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
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'look-what-karen-have.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, base.width, base.height);
			ctx.rotate(-6.5 * (Math.PI / 180));
			ctx.drawImage(avatar, 514, 50, 512, 512);
			ctx.rotate(6.5 * (Math.PI / 180));
			ctx.drawImage(base, 0, 0);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'look-what-karen-have.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
