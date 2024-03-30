const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { wrapText } = require('../../util/Canvas');

module.exports = class ReactionMemeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reaction-meme',
			aliases: ['meme-gen-modern', 'mgm'],
			group: 'edit-meme',
			memberName: 'reaction-meme',
			description: 'Sends a meme with the text and image of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What should the text of the meme be?',
					type: 'string'
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 1024 })
				}
			]
		});
	}

	async run(msg, { text, image }) {
		const { body } = await request.get(image);
		const base = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(40);
		const lines = await wrapText(ctx, text, base.width - 10);
		const lineBreakLen = text.split('\n').length;
		const linesLen = (40 * lines.length)
			+ (40 * (lineBreakLen - 1))
			+ (14 * lines.length)
			+ (14 * (lineBreakLen - 1))
			+ 14;
		canvas.height += linesLen;
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(40);
		ctx.textBaseline = 'top';
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, base.width, linesLen);
		ctx.fillStyle = 'black';
		ctx.fillText(lines.join('\n'), 5, 5);
		ctx.drawImage(base, 0, linesLen);
		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
		return msg.say({ files: [{ attachment, name: 'meme-gen-modern.png' }] });
	}
};
