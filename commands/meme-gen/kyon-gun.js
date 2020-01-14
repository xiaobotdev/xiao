const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class KyonGunCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kyon-gun',
			aliases: ['kyon-snapped', 'endless-eight'],
			group: 'meme-gen',
			memberName: 'kyon-gun',
			description: 'Draws an image or a user\'s avatar behind Kyon shooting a gun.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'The Melancholy of Haruhi Suzumiya',
					url: 'http://www.haruhi.tv/',
					reason: 'Original Anime'
				},
				{
					name: 'Know Your Meme',
					url: 'https://knowyourmeme.com/',
					reason: 'Image',
					reasonURL: 'https://knowyourmeme.com/photos/217992-endless-eight-kyon-kun-denwa'
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
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'kyon-gun.png'));
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
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'kyon-gun.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
