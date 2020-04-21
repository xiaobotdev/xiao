const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'OPTIKorinna-Agency.otf'), { family: 'Korinna' });

module.exports = class JeopardyQuestionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'jeopardy-question',
			aliases: ['jeopardy', 'clue-card', 'jeopardy-clue-card', 'jeopardy-clue'],
			group: 'edit-image',
			memberName: 'jeopardy-question',
			description: 'Sends a Jeopardy Question with the text of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Jeopardy',
					url: 'https://www.jeopardy.com/',
					reason: 'Original Show'
				},
				{
					name: 'OPTIFONT',
					url: 'http://opti.netii.net/',
					reason: 'Korinna Agency Font',
					reasonURL: 'https://fontmeme.com/fonts/korinna-agency-font/'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What should the text of the question be?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { text }) {
		const canvas = createCanvas(1280, 720);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = '#030e78';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillStyle = 'white';
		ctx.font = '62px Korinna';
		const lines = await wrapText(ctx, text, 813);
		const topMost = (canvas.height / 2) - (((62 * lines.length) / 2) + ((27 * (lines.length - 1)) / 2));
		ctx.fillStyle = 'black';
		ctx.fillText(lines.join('\n'), (canvas.width / 2) + 6, topMost + 6);
		ctx.fillStyle = 'white';
		ctx.fillText(lines.join('\n'), canvas.width / 2, topMost);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'jeopardy-question.png' }] });
	}
};
