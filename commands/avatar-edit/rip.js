const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');

module.exports = class RIPCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rip',
			aliases: ['grave', 'grave-stone'],
			group: 'avatar-edit',
			memberName: 'rip',
			description: 'Draws a user\'s avatar over a gravestone.',
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
			const canvas = createCanvas(507, 338);
			const ctx = canvas.getContext('2d');
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'rip.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 158, 51, 200, 200);
			const imgData = ctx.getImageData(158, 51, 200, 200);
			const { data } = imgData;
			for (let i = 0; i < data.length; i += 4) {
				const brightness = (0.34 * data[i]) + (0.5 * data[i + 1]) + (0.16 * data[i + 2]);
				data[i] = brightness;
				data[i + 1] = brightness;
				data[i + 2] = brightness;
			}
			ctx.putImageData(imgData, 158, 51);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'rip.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
