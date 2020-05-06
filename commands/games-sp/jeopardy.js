const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { createCanvas, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'OPTIKorinna-Agency.otf'), { family: 'Korinna' });

module.exports = class JeopardyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'jeopardy',
			group: 'games-sp',
			memberName: 'jeopardy',
			description: 'Answer a Jeopardy question.',
			credit: [
				{
					name: 'jService',
					url: 'http://jservice.io/',
					reason: 'API'
				},
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
			]
		});
	}

	async run(msg) {
		try {
			const question = await this.fetchQuestion();
			const clueCard = await this.generateClueCard(question.question.replace(/<\/?i>/gi, ''));
			await msg.reply(`The category is: **${question.category.title.toUpperCase()}**. 30 seconds, good luck.`, {
				files: [{ attachment: clueCard, name: 'clue-card.png' }]
			});
			const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
				max: 1,
				time: 30000
			});
			const answer = question.answer.replace(/<\/?i>/gi, '*');
			if (!msgs.size) return msg.reply(`Time's up, the answer was **${answer}**.`);
			const win = msgs.first().content.toLowerCase() === answer.toLowerCase();
			if (!win) return msg.reply(`The answer was **${answer}**.`);
			return msg.reply(`The answer was **${answer}**. Good job!`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchQuestion() {
		const { body } = await request
			.get('http://jservice.io/api/random')
			.query({ count: 1 });
		return body[0];
	}

	async generateClueCard(question) {
		const canvas = createCanvas(1280, 720);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = '#030e78';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillStyle = 'white';
		ctx.font = '62px Korinna';
		const lines = await wrapText(ctx, question.toUpperCase(), 813);
		const topMost = (canvas.height / 2) - (((52 * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			const height = topMost + ((52 + 20) * i);
			ctx.fillStyle = 'black';
			ctx.fillText(lines[i], (canvas.width / 2) + 6, height + 6);
			ctx.fillStyle = 'white';
			ctx.fillText(lines[i], canvas.width / 2, height);
		}
		return canvas.toBuffer();
	}
};
