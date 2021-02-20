const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class BoardroomMeetingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'boardroom-meeting',
			aliases: ['boardroom-suggestion', 'boardroom'],
			group: 'edit-meme',
			memberName: 'boardroom-meeting',
			description: 'Sends a "Boardroom Meeting" meme with the text of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'hejibits',
					url: 'https://hejibits.com/',
					reason: 'Image',
					reasonURL: 'https://web.archive.org/web/20121226235748/https://hejibits.com/comics/outlook-oust/'
				},
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				}
			],
			args: [
				{
					key: 'question',
					prompt: 'What question should the meeting leader ask?',
					type: 'string',
					max: 100
				},
				{
					key: 'suggestion1',
					label: 'first suggestion',
					prompt: 'What should the first employee suggest?',
					type: 'string',
					max: 50
				},
				{
					key: 'suggestion2',
					label: 'second suggestion',
					prompt: 'What should the second employee suggest?',
					type: 'string',
					max: 50
				},
				{
					key: 'final',
					label: 'final suggestion',
					prompt: 'What should the employee who gets thrown out the window suggest?',
					type: 'string',
					max: 50
				}
			]
		});
	}

	async run(msg, { question, suggestion1, suggestion2, final }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'boardroom-meeting.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(25);
		ctx.fillText(question, 153, 8, 300);
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(15);
		ctx.fillText(suggestion1, 30, 251, 90);
		ctx.fillText(suggestion2, 167, 258, 75);
		ctx.fillText(final, 310, 269, 130);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'boardroom-meeting.png' }] });
	}
};
