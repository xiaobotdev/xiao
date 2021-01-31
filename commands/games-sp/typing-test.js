const Command = require('../../structures/Command');
const { createCanvas, registerFont } = require('canvas');
const { stripIndents } = require('common-tags');
const path = require('path');
const { list, fetchHSUserDisplay } = require('../../util/Util');
const words = require('../../assets/json/word-list');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
const difficulties = ['baby', 'easy', 'medium', 'hard', 'extreme', 'impossible'];
const times = {
	baby: 60000,
	easy: 25000,
	medium: 20000,
	hard: 15000,
	extreme: 10000,
	impossible: 5000
};

module.exports = class TypingTestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'typing-test',
			group: 'games-sp',
			memberName: 'typing-test',
			description: 'See how fast you can type a sentence in a given time limit.',
			details: `**Difficulties:** ${difficulties.join(', ')}`,
			args: [
				{
					key: 'difficulty',
					prompt: `What should the difficulty of the game be? Either ${list(difficulties, 'or')}.`,
					type: 'string',
					oneOf: difficulties,
					parse: difficulty => difficulty.toLowerCase()
				}
			]
		});
	}

	async run(msg, { difficulty }) {
		const sentence = this.generateSentence(6);
		const time = times[difficulty];
		await msg.reply(`**You have ${time / 1000} seconds to type this sentence.**`, {
			files: [{ attachment: this.generateImage(sentence), name: 'typing-test.png' }]
		});
		const now = Date.now();
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time
		});
		const newScore = Date.now() - now;
		const highScoreGet = await this.client.redis.get('typing-test');
		const highScore = highScoreGet ? Number.parseInt(highScoreGet, 10) : null;
		const highScoreUser = await this.client.redis.get('typing-test-user');
		const scoreBeat = !highScore || highScore > newScore;
		const user = await fetchHSUserDisplay(this.client, highScoreUser);
		if (scoreBeat) {
			await this.client.redis.set('typing-test', newScore);
			await this.client.redis.set('typing-test-user', msg.author.id);
		}
		if (!msgs.size) return msg.reply('Sorry! You lose!');
		if (msgs.first().content !== sentence) return msg.reply('Sorry! You made a typo, so you lose!');
		return msg.reply(stripIndents`
			Nice job! 10/10! You deserve some cake! (Took ${newScore / 1000} seconds)
			${scoreBeat ? `**New High Score!** Old:` : `High Score:`} ${highScore / 1000} (Held by ${user})
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
		ctxPre.font = '75px Noto';
		const len = ctxPre.measureText(sentence);
		const canvas = createCanvas(100 + len.width, 200);
		const ctx = canvas.getContext('2d');
		ctx.font = '75px Noto';
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'black';
		ctx.fillText(sentence, canvas.width / 2, canvas.height / 2);
		return canvas.toBuffer();
	}
};
