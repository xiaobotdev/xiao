const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const path = require('path');

module.exports = class TriggeredCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'triggered',
			group: 'avatar-edit',
			memberName: 'triggered',
			description: 'Draws a user\'s avatar over a Triggered meme.',
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
			const canvas = createCanvas(320, 371);
			const ctx = canvas.getContext('2d');
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'triggered.png'));
			const { body } = await snekfetch.get(avatarURL);
			const avatar = await loadImage(body);
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, 320, 371);
			ctx.drawImage(avatar, 0, 0, 320, 320);
			const imgData = ctx.getImageData(0, 0, 320, 320);
			const { data } = imgData;
			for (let i = 0; i < data.length; i += 4) data[i] = Math.max(255, data[i]);
			ctx.putImageData(imgData, 0, 0);
			ctx.drawImage(base, 0, 0);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'triggered.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
