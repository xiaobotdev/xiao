const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');

module.exports = class InvertCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'invert',
			group: 'avatar-edit',
			memberName: 'invert',
			description: 'Draws a user\'s avatar inverted.',
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
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			ctx.drawImage(avatar, 0, 0, 256, 256);
			const imgData = ctx.getImageData(0, 0, 256, 256);
			const { data } = imgData;
			for (let i = 0; i < data.length; i += 4) {
				data[i] = 255 - data[i];
				data[i + 1] = 255 - data[i + 1];
				data[i + 2] = 255 - data[i + 2];
			}
			ctx.putImageData(imgData, 0, 0);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'invert.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
