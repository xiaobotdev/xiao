const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImage } = require('../../util/Canvas');

module.exports = class ApprovedCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'approved',
			aliases: ['approve'],
			group: 'edit-image',
			memberName: 'approved',
			description: 'Draws an "approved" stamp over an image or a user\'s avatar.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Redeeming God',
					url: 'https://redeeminggod.com/',
					reason: 'Image',
					reasonURL: 'https://redeeminggod.com/courses/gospel-dictionary/lessons/gospel-dictionary-approved/'
				}
			],
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'approved.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		const { x, y, width, height } = centerImage(base, data);
		ctx.drawImage(base, x, y, width, height);
		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
		return msg.say({ files: [{ attachment, name: 'approved.png' }] });
	}
};
