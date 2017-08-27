const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');

module.exports = class ThugLifeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'thug-life',
			group: 'avatar-edit',
			memberName: 'thug-life',
			description: 'Draws "Thug Life" over a user\'s avatar.',
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
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'thug-life.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			ctx.drawImage(avatar, 0, 0, 256, 256);
			ctx.drawImage(base, 15, 175, 225, 75);
			const imgData = ctx.getImageData(0, 0, 256, 256);
			const { data } = imgData;
			for (let i = 0; i < data.length; i += 4) {
				const brightness = (0.34 * data[i]) + (0.5 * data[i + 1]) + (0.16 * data[i + 2]);
				data[i] = brightness;
				data[i + 1] = brightness;
				data[i + 2] = brightness;
			}
			ctx.putImageData(imgData, 0, 0);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'thug-life.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
