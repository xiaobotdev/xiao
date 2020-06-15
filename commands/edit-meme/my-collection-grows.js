const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class MyCollectionGrowsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'my-collection-grows',
			aliases: ['my-collection-grows-richer', 'collection-grows', 'collection-grows-richer'],
			group: 'edit-meme',
			memberName: 'my-collection-grows',
			description: 'Sends a "My collection grows richer" Nekopara meme with the text of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Nekopara',
					url: 'http://nekopara.com/main.html',
					reason: 'Image, Original Anime',
					reasonURL: 'https://nekopara-anime.com/'
				}
			],
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 256 })
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'my-collection-grows.png'));
			const { body } = await request.get(image);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, base.width, base.height);
			ctx.rotate(-14 * (Math.PI / 180));
			const { x, y, width, height } = centerImagePart(avatar, 425, 425, 145, 179);
			ctx.drawImage(avatar, x, y, width, height);
			ctx.rotate(14 * (Math.PI / 180));
			ctx.drawImage(base, 0, 0);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'my-collection-grows.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
