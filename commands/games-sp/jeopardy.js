const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { createCanvas } = require('canvas');
const path = require('path');
const { reactIfAble } = require('../../util/Util');
const { wrapText } = require('../../util/Canvas');

module.exports = class JeopardyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'jeopardy',
			group: 'games-sp',
			memberName: 'jeopardy',
			description: 'Answer a Jeopardy question.',
			throttling: {
				usages: 1,
				duration: 10
			},
			credit: [
				{
					name: 'jService',
					url: 'http://jservice.io/',
					reason: 'API'
				},
				{
					name: 'Jeopardy',
					url: 'https://www.jeopardy.com/',
					reason: 'Music, Original Show'
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
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		try {
			this.client.games.set(msg.channel.id, { name: this.name });
			const question = await this.fetchQuestion();
			const clueCard = await this.generateClueCard(question.question.replace(/<\/?i>/gi, ''));
			const connection = msg.guild ? this.client.voice.connections.get(msg.guild.id) : null;
			if (connection) {
				connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', 'jeopardy.mp3'));
				await reactIfAble(msg, this.client.user, '🔉');
			}
			await msg.reply(`The category is: **${question.category.title.toUpperCase()}**. 30 seconds, good luck.`, {
				files: [{ attachment: clueCard, name: 'clue-card.png' }]
			});
			const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
				max: 1,
				time: 30000
			});
			if (connection && connection.dispatcher) connection.dispatcher.end();
			const answer = question.answer.replace(/<\/?i>/gi, '*');
			this.client.games.delete(msg.channel.id);
			if (!msgs.size) return msg.reply(`Time's up, the answer was **${answer}**.`);
			const win = msgs.first().content.toLowerCase() === answer.toLowerCase();
			if (!win) return msg.reply(`The answer was **${answer}**.`);
			return msg.reply(`The answer was **${answer}**. Good job!`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchQuestion() {
		const { body } = await request
			.get('http://jservice.io/api/random')
			.query({ count: 1 });
		const data = body[0];
		if (!data.question || !data.answer) {
			await this.markInvalid(data.id);
			return this.fetchQuestion();
		}
		return data;
	}

	async markInvalid(id) {
		const { body } = await request
			.post('http://jservice.io/api/invalid')
			.query({ id });
		return body;
	}

	async generateClueCard(question) {
		const canvas = createCanvas(1280, 720);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = '#030e78';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillStyle = 'white';
		ctx.font = this.client.fonts.get('OPTIKorinna-Agency.otf').toCanvasString(62);
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
