const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class LookAtThisPhotographCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'look-at-this-photograph',
			aliases: ['nickelback', 'look-at-this-photo', 'photograph'],
			group: 'edit-meme',
			memberName: 'look-at-this-photograph',
			description: 'Draws an image or a user\'s avatar over Nickelback\'s photograph.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Nickelback',
					url: 'https://www.nickelback.com/',
					reason: 'Image, Original "Photograph" Music Video',
					reasonURL: 'https://www.youtube.com/watch?v=BB0DU4DoPP4'
				}
			],
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 256 })
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'look-at-this-photograph.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.rotate(-13.5 * (Math.PI / 180));
			ctx.drawImage(data, 280, 218, 175, 125);
			ctx.rotate(13.5 * (Math.PI / 180));
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'look-at-this-photograph.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
