const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas } = require('@napi-rs/canvas');
const { wrapText } = require('../../util/Canvas');

module.exports = class JeopardyQuestionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'jeopardy-question',
			aliases: ['clue-card', 'jeopardy-clue-card', 'jeopardy-clue'],
			group: 'edit-image-text',
			memberName: 'jeopardy-question',
			description: 'Sends a Jeopardy Question with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
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
					type: 'string',
					max: 500
				}
			]
		});
	}

	run(msg, { text }) {
		const canvas = createCanvas(1280, 720);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = '#030e78';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillStyle = 'white';
		ctx.font = this.client.fonts.get('OPTIKorinna-Agency.otf').toCanvasString(62);
		const lines = wrapText(ctx, text.toUpperCase(), 813);
		const topMost = (canvas.height / 2) - (((52 * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			const height = topMost + ((52 + 20) * i);
			ctx.fillStyle = 'black';
			ctx.fillText(lines[i], (canvas.width / 2) + 6, height + 6);
			ctx.fillStyle = 'white';
			ctx.fillText(lines[i], canvas.width / 2, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'jeopardy-question.png' }] });
	}
};
