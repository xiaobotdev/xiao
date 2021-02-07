const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class UltimateTattooCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ultimate-tattoo',
			aliases: ['the-ultimate-tattoo', 'tattoo'],
			group: 'edit-meme',
			memberName: 'ultimate-tattoo',
			description: 'Draws an image or a user\'s avatar as "The Ultimate Tattoo".',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Deathbulge',
					url: 'http://deathbulge.com/comics',
					reason: 'Image',
					reasonURL: 'http://deathbulge.com/comics/114'
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
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'ultimate-tattoo.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.rotate(-10 * (Math.PI / 180));
			const { x, y, width, height } = centerImagePart(data, 300, 300, 84, 690);
			ctx.drawImage(data, x, y, width, height);
			ctx.rotate(10 * (Math.PI / 180));
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'ultimate-tattoo.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
