const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');

module.exports = class WantedCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wanted',
			group: 'avatar-edit',
			memberName: 'wanted',
			description: 'Draws a user\'s avatar over a wanted poster.',
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
			size: 512
		});
		try {
			const canvas = createCanvas(741, 1000);
			const ctx = canvas.getContext('2d');
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'wanted.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 150, 360, 430, 430);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'wanted.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
