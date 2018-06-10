const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { shortenText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class DemotivationalPosterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'demotivational-poster',
			aliases: ['demotivational'],
			group: 'image-edit',
			memberName: 'demotivational-poster',
			description: 'Draws an image or a user\'s avatar and the text you specify as a demotivational poster.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'title',
					prompt: 'What should the title of the poster be?',
					type: 'string',
					parse: title => title.toUpperCase()
				},
				{
					key: 'text',
					prompt: 'What should the text of the poster be?',
					type: 'string'
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image|avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 1024 })
				}
			]
		});
	}

	async run(msg, { title, text, image }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'demotivational-poster.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, base.width, base.height);
			ctx.drawImage(data, 69, 44, 612, 412);
			ctx.drawImage(base, 0, 0);
			ctx.textAlign = 'center';
			ctx.font = '60px Noto';
			ctx.fillStyle = 'aquamarine';
			ctx.fillText(shortenText(ctx, title, 610), 375, 518);
			ctx.font = '27px Noto';
			ctx.fillStyle = 'white';
			ctx.fillText(shortenText(ctx, text, 610), 375, 565);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'demotivational-poster.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
