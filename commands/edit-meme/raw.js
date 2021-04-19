const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class RawCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'raw',
			aliases: ['doing-it-raw'],
			group: 'edit-meme',
			memberName: 'raw',
			description: 'Sends a "Give me x, and I wouldn\'t mind doing it raw!" meme with the text of your choice.',
			nsfw: true,
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Inside Scanlation',
					url: 'https://www.insidescanlation.com/',
					reason: 'Wild Words Font',
					// eslint-disable-next-line max-len
					reasonURL: 'https://www.insidescanlation.com/etc/the-idiots-guide-to-editing-manga/guide/type/fonts.html'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What makes her want to do it raw?',
					type: 'string',
					max: 100
				}
			]
		});
	}

	async run(msg, { text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'raw.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('wildwordsroman.ttf').toCanvasString(23);
		ctx.fillText(text, 520, 143, 165);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'raw.png' }] });
	}
};
