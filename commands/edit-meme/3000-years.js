const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class ThreeThousandYearsCommand extends Command {
	constructor(client) {
		super(client, {
			name: '3000-years',
			aliases: ['3ky', '3k-years'],
			group: 'edit-meme',
			memberName: '3000-years',
			description: 'Draws an image or a user\'s avatar over Pokémon\'s "It\'s been 3000 years" meme.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Pokémon',
					url: 'https://www.pokemon.com/us/',
					reason: 'Image, Original Game'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 256 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', '3000-years.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		const { x, y, width, height } = centerImagePart(data, 200, 200, 461, 127);
		ctx.drawImage(data, x, y, width, height);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: '3000-years.png' }] });
	}
};
