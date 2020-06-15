const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class WorthlessCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'worthless',
			aliases: ['this-is-worthless'],
			group: 'edit-meme',
			memberName: 'worthless',
			description: 'Draws an image or a user\'s avatar over Gravity Falls\' "This is worthless." meme.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Disney',
					url: 'https://www.disney.com/',
					reason: 'Original "Gravity Falls" Show',
					reasonURL: 'https://disneynow.com/shows/gravity-falls'
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
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'worthless.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.rotate(6 * (Math.PI / 180));
			const center1 = centerImagePart(data, 400, 400, 496, 183);
			ctx.drawImage(data, center1.x, center1.y, center1.width, center1.height);
			ctx.rotate(-6 * (Math.PI / 180));
			ctx.translate(canvas.width / 2, canvas.height / 2);
			ctx.rotate(160 * (Math.PI / 180));
			ctx.translate(-(canvas.width / 2), -(canvas.height / 2));
			const center2 = centerImagePart(data, 75, 75, 625, 55);
			ctx.drawImage(data, center2.x, center2.y, center2.width, center2.height);
			ctx.rotate(-160 * (Math.PI / 180));
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'worthless.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
