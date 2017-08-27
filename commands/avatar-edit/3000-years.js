const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');

module.exports = class YearsCommand extends Command {
	constructor(client) {
		super(client, {
			name: '3000-years',
			aliases: ['az', '3ky', '3k-years'],
			group: 'avatar-edit',
			memberName: '3000-years',
			description: 'Draws a user\'s avatar over Pokémon\'s "It\'s been 3000 years" meme.',
			throttling: {
				usages: 1,
				duration: 30
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		const user = args.user || msg.author;
		const avatarURL = user.displayAvatarURL({
			format: 'png',
			size: 256
		});
		try {
			const canvas = createCanvas(856, 569);
			const ctx = canvas.getContext('2d');
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', '3000-years.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 461, 127, 200, 200);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: '3000-years.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
