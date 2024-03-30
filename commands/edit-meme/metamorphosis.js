const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class MetamorphosisCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'metamorphosis',
			aliases: ['my-metamorphosis-begins', 'morph'],
			group: 'edit-meme',
			memberName: 'metamorphosis',
			description: 'Sends a "My Metamorphosis Begins" meme with the image and text of your choice.',
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
				},
				{
					name: 'Yeah I\'m Stuck in the Void, Keep Scrolling',
					url: 'https://www.facebook.com/voidmanthing/',
					reason: 'Image',
					reasonURL: 'https://www.facebook.com/voidmanthing/posts/125724262420450'
				}
			],
			args: [
				{
					key: 'name',
					prompt: 'What is the name of thing to morph into?',
					type: 'string',
					max: 280
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'metamorphosis.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		const { x, y, width, height } = centerImagePart(data, 200, 200, 412, 257);
		ctx.drawImage(data, x, y, width, height);
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(20);
		ctx.fillText(`le ${name.toLowerCase()}`, 345, 466, 330);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'metamorphosis.png' }] });
	}
};
