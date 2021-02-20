const Command = require('../../structures/Command');
const { createCanvas } = require('canvas');
const pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ23456789'.split('');

module.exports = class CaptchaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'captcha',
			aliases: ['captcha-quiz'],
			group: 'games-sp',
			memberName: 'captcha',
			description: 'Try to guess what the captcha says.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Christoph Mueller',
					url: 'https://www.fontsquirrel.com/fonts/list/foundry/christoph-mueller',
					reason: 'Moms Typewriter Font',
					reasonURL: 'https://www.fontsquirrel.com/fonts/MomsTypewriter'
				}
			]
		});
	}

	async run(msg) {
		const canvas = createCanvas(125, 32);
		const ctx = canvas.getContext('2d');
		const text = this.randomText(5);
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.strokeStyle = '#0088cc';
		ctx.font = this.client.fonts.get('Captcha.ttf').toCanvasString(26);
		ctx.rotate(-0.05);
		ctx.strokeText(text, 15, 26);
		await msg.reply(
			'**You have 15 seconds, what does the captcha say?**',
			{ files: [{ attachment: canvas.toBuffer(), name: 'captcha-quiz.png' }] }
		);
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time: 15000
		});
		if (!msgs.size) return msg.reply(`Sorry, time is up! It was ${text}.`);
		if (msgs.first().content !== text) return msg.reply(`Nope, sorry, it's ${text}.`);
		return msg.reply('Nice job! 10/10! You deserve some cake!');
	}

	randomText(len) {
		const result = [];
		for (let i = 0; i < len; i++) result.push(pool[Math.floor(Math.random() * pool.length)]);
		return result.join('');
	}
};
