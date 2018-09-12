const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { wrapText, greyscale, drawImageWithTint } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class NikeAdCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nike-ad',
			aliases: ['believe-in-something', 'believe-in'],
			group: 'image-edit',
			memberName: 'nike-ad',
			description: 'Sends a "Believe in Something" Nike Ad meme with the text of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'something',
					prompt: 'What should the something to believe in be?',
					type: 'string',
					max: 20,
					parse: something => something.toLowerCase()
				},
				{
					key: 'sacrifice',
					prompt: 'What should believing result in (e.g. sacrificing everything)?',
					type: 'string',
					max: 50,
					parse: sacrifice => sacrifice.toLowerCase()
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 2048 })
				}
			]
		});
	}

	async run(msg, { image, something, sacrifice }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'nike-ad.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			drawImageWithTint(ctx, data, 'black', 0, 0, data.width, data.height);
			greyscale(ctx, 0, 0, data.width, data.height);
			ctx.drawImage(base, (data.width / 2) - (base.width / 2), data.height - base.height);
			ctx.font = `${Math.round(data.height / 25)}px Noto`;
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			const text = wrapText(ctx, `Believe in ${something}. Even if it means ${sacrifice}.`, data.width);
			ctx.fillText(text.join('\n'), data.width / 2, data.height / 2);
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'nike-ad.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
