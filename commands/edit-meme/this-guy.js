const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class ThisGuyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'this-guy',
			aliases: ['get-a-load-of-this-guy'],
			group: 'edit-meme',
			memberName: 'this-guy',
			description: 'Draws an image or a user\'s avatar over the \"Get a load of this guy\" meme.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Warner Bros.',
					url: 'https://www.warnerbros.com/',
					reason: 'Image, Original "Friends" TV Series',
					reasonURL: 'https://www.warnerbros.com/tv/friends/'
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
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'this-guy.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			const { x, y, width, height } = centerImagePart(data, 722, 722, 152, 123);
			ctx.drawImage(data, x, y, width, height);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'this-guy.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
