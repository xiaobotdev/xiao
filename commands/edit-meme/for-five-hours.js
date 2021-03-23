const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class ForFiveHoursCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'for-five-hours',
			aliases: ['its-beautiful-ive-looked-at-this-for-five-hours-now', 'its-beautiful'],
			group: 'edit-meme',
			memberName: 'for-five-hours',
			description: 'Sends an "I\'ve looked at this for 5 hours now" meme with the image of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'NBC',
					url: 'https://www.nbc.com/',
					reason: 'Image, Original "The Office" TV Series',
					reasonURL: 'https://www.nbc.com/the-office'
				}
			],
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 1024 })
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const { body } = await request.get(image);
			const base = await loadImage(body);
			const plate = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'for-five-hours.png'));
			const scaleH = plate.width / base.width;
			const height = Math.round(base.height * scaleH);
			const canvas = createCanvas(plate.width, plate.height + height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0, plate.width, height);
			ctx.drawImage(plate, 0, height + 1);
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'for-five-hours.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
