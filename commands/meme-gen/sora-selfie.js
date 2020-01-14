const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class SoraSelfieCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sora-selfie',
			group: 'meme-gen',
			memberName: 'sora-selfie',
			description: 'Draws an image or a user\'s avatar behind Sora taking a selfie.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Square Enix',
					url: 'https://square-enix-games.com/',
					reason: 'Original "Kingdom Hearts" Game',
					reasonURL: 'https://www.kingdomhearts.com/home/us/'
				},
				{
					name: '@Candasaurus',
					url: 'https://twitter.com/Candasaurus',
					reason: 'Image',
					reasonURL: 'https://twitter.com/Candasaurus/status/1041946636656599045'
				}
			],
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'sora-selfie.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = 'black';
			ctx.fillRect(0, 0, base.width, base.height);
			const ratio = data.width / data.height;
			const width = Math.round(base.height * ratio);
			ctx.drawImage(data, (base.width / 2) - (width / 2), 0, width, base.height);
			ctx.drawImage(base, 0, 0);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'sora-selfie.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
