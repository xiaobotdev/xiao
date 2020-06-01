const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Konosuba.ttf'), { family: 'Konosuba' });

module.exports = class AxisCultSignUpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'axis-cult-sign-up',
			aliases: ['axis-sign-up'],
			group: 'edit-image',
			memberName: 'axis-cult-sign-up',
			description: 'Sends an Axis Cult Sign-Up sheet for you. Join today!',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'cheesecakejedi',
					url: 'https://imgur.com/user/cheesecakejedi',
					reason: 'Image',
					reasonURL: 'https://imgur.com/gallery/quQTD'
				},
				{
					name: 'hbl917070',
					url: 'https://github.com/hbl917070',
					reason: 'Font',
					reasonURL: 'https://github.com/hbl917070/Konosuba-text'
				},
				{
					name: 'KONOSUBA -God\'s blessing on this wonderful world!',
					url: 'http://konosuba.com/',
					reason: 'Original Anime'
				}
			],
			args: [
				{
					key: 'gender',
					prompt: 'What is your gender?',
					type: 'string',
					oneOf: ['male', 'female']
				},
				{
					key: 'age',
					prompt: 'How old are you?',
					type: 'integer',
					min: 1,
					max: 10000
				},
				{
					key: 'profession',
					prompt: 'What is your profession?',
					type: 'string',
					max: 15
				}
			]
		});
	}

	async run(msg, { gender, age, profession }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'axis-cult-sign-up.jpg'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = '96px Konosuba';
		ctx.fillText(msg.author.username, 960, 1558);
		ctx.fillText(gender, 960, 1752);
		ctx.fillText(age, 1700, 1752);
		ctx.fillText('XXX-XXX-XXXX', 960, 1960);
		ctx.fillText(profession, 960, 2169);
		ctx.fillText('Xiao', 960, 2370);
		ctx.font = '123px Konosuba';
		ctx.fillText('ERIS PADS\nHER CHEST!', 1037, 2874);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/jpeg'), name: 'axis-cult-sign-up.jpg' }] });
	}
};
