const Command = require('../../framework/Command');
const { createCanvas } = require('canvas');
const { stripIndents } = require('common-tags');
const Diff = require('text-diff');
const { fetchHSUserDisplay } = require('../../util/Util');
const words = require('../../assets/json/word-list');

module.exports = class TypingTestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'typing-test',
			group: 'games-sp',
			memberName: 'typing-test',
			description: 'See how fast you can type a sentence.',
			game: true
		});
	}

	async run(msg) {
		const sentence = this.generateSentence(5);
		await msg.reply(`**You have 30 seconds to type this sentence.**`, {
			files: [{ attachment: this.generateImage(sentence), name: 'typing-test.png' }]
		});
		const now = Date.now();
		const msgs = await msg.channel.awaitMessages({
			filter: res => res.author.id === msg.author.id,
			max: 1,
			time: 30000
		});
		const win = msgs.size && msgs.first().content.toLowerCase() === sentence;
		const newScore = Date.now() - now;
		const highScoreGet = await this.client.redis.db.get('typing-test');
		const highScore = highScoreGet ? Number.parseInt(highScoreGet, 10) : null;
		const highScoreUser = await this.client.redis.db.get('typing-test-user');
		const scoreBeat = win && (!highScore || highScore > newScore);
		const user = await fetchHSUserDisplay(this.client, highScoreUser);
		if (scoreBeat) {
			await this.client.redis.db.set('typing-test', newScore);
			await this.client.redis.db.set('typing-test-user', msg.author.id);
		}
		if (!msgs.size) return msg.reply('Sorry! You lose!');
		if (msgs.first().content.toLowerCase() !== sentence) {
			const diff = new Diff();
			const textDiff = diff.main(msgs.first().content.toLowerCase(), sentence);
			diff.cleanupSemantic(textDiff);
			const formatted = textDiff.map(change => {
				if (change[0] === 1) return `**${change[1]}**`;
				if (change[0] === 0) return change[1];
				return '';
			}).join('');
			return msg.reply(stripIndents`
				Sorry! You made a typo, so you lose!
				${formatted}
			`);
		}
		const wpm = (sentence.length / 5) / ((newScore / 1000) / 60);
		return msg.reply(stripIndents`
			Nice job! 10/10! You deserve some cake! (Took ${newScore / 1000} seconds, ${Math.round(wpm)} WPM)
			${scoreBeat ? `**New High Score!** Old:` : `High Score:`} ${highScore / 1000}s (Held by ${user})
		`);
	}

	generateSentence(length) {
		const sentence = [];
		for (let i = 0; i < length; i++) sentence.push(words[Math.floor(Math.random() * words.length)]);
		return sentence.join(' ');
	}

	generateImage(sentence) {
		const canvasPre = createCanvas(1, 1);
		const ctxPre = canvasPre.getContext('2d');
		ctxPre.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(75);
		const len = ctxPre.measureText(sentence);
		const canvas = createCanvas(100 + len.width, 200);
		const ctx = canvas.getContext('2d');
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(75);
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'black';
		ctx.fillText(sentence, canvas.width / 2, canvas.height / 2);
		return canvas.toBuffer();
	}
};
