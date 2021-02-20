const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class EnslavedCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'enslaved',
			aliases: ['ah-yes-enslaved', 'ah-yes', 'enslave'],
			group: 'edit-meme',
			memberName: 'enslaved',
			description: 'Sends a "Ah yes, enslaved" meme with the image and text of your choice.',
			throttling: {
				usages: 1,
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
					key: 'name',
					prompt: 'What is the name of thing you want to enslave?',
					type: 'string',
					max: 20
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 256 })
				}
			]
		});
	}

	async run(msg, { name, image }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'enslaved.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			const { x, y, width, height } = centerImagePart(data, 200, 200, 254, 145);
			ctx.drawImage(data, x, y, width, height);
			ctx.textBaseline = 'top';
			ctx.textAlign = 'center';
			ctx.fillStyle = 'white';
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(50);
			ctx.fillText(name.toLowerCase(), 365, 400, 240);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'enslaved.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
