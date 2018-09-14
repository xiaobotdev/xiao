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
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 1024 })
				}
			]
		});
	}

	async run(msg, { title, text, image }) {
		try {
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(750, 600);
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = 'black';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			const ratio = data.width / data.height;
			const width = Math.min(Math.round(402 / ratio), 602);
			const x = (canvas.width / 2) - (width / 2);
			ctx.fillStyle = 'white';
			ctx.fillRect(x - 4, 40, width + 8, 406);
			ctx.fillStyle = 'black';
			ctx.fillRect(x - 2, 42, width + 4, 404);
			ctx.fillStyle = 'white';
			ctx.fillRect(x, 44, width, 402);
			ctx.drawImage(data, x, 44, width, 402);
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
