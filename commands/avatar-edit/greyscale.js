const { Command } = require('discord.js-commando');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');

module.exports = class GreyscaleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'greyscale',
			aliases: ['grayscale'],
			group: 'avatar-edit',
			memberName: 'greyscale',
			description: 'Draws a user\'s avatar in greyscale.',
			throttling: {
				usages: 1,
				duration: 15
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

	async run(msg, { user }) {
		if (!user) user = msg.author;
		const avatarURL = user.displayAvatarURL({
			format: 'png',
			size: 512
		});
		try {
			const canvas = createCanvas(512, 512);
			const ctx = canvas.getContext('2d');
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			ctx.drawImage(avatar, 0, 0, 512, 512);
			const imgData = ctx.getImageData(0, 0, 512, 512);
			const { data } = imgData;
			for (let i = 0; i < data.length; i += 4) {
				const brightness = (0.34 * data[i]) + (0.5 * data[i + 1]) + (0.16 * data[i + 2]);
				data[i] = brightness;
				data[i + 1] = brightness;
				data[i + 2] = brightness;
			}
			ctx.putImageData(imgData, 0, 0);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'greyscale.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
