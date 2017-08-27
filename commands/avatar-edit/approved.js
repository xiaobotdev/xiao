const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');

module.exports = class ApprovedCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'approved',
			aliases: ['approve'],
			group: 'avatar-edit',
			memberName: 'approved',
			description: 'Draws an "approved" stamp over a user\'s avatar.',
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
			const canvas = createCanvas(256, 256);
			const ctx = canvas.getContext('2d');
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'approved.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			ctx.drawImage(avatar, 0, 0, 256, 256);
			ctx.drawImage(base, 0, 0, 256, 256);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'approved.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
