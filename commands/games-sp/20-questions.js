const Command = require('../../structures/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { stripIndents } = require('common-tags');
const baseURI = 'http://y.20q.net';

module.exports = class TwentyQuestionsCommand extends Command {
	constructor(client) {
		super(client, {
			name: '20-questions',
			aliases: ['twenty-questions', '20-q', 'twenty-q'],
			group: 'games-sp',
			memberName: '20-questions',
			description: 'Think of something and 20Q will read your mind by asking a few simple questions.',
			credit: [
				{
					name: '20Q.net',
					url: 'http://20q.net/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		try {
			const startURL = await this.initialize();
			let question = await this.startGame(startURL);
			let referer = question.url;
			let win = null;
			this.client.games.set(msg.channel.id, { name: this.name });
			while (win === null) {
				const answers = question.answers.map(answer => answer.text.toLowerCase());
				answers.push('end');
				await msg.say(stripIndents`
					**${question.question}**
					${question.answers.map(answer => answer.text).join(' | ')} | End
				`);
				const filter = res => res.author.id === msg.author.id && answers.includes(res.content.toLowerCase());
				const msgs = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 30000
				});
				if (!msgs.size) {
					await msg.say('Sorry, time is up!');
					win = 'time';
					break;
				}
				const choice = msgs.first().content.toLowerCase();
				if (choice === 'end') {
					win = 'time';
					break;
				}
				const answer = question.answers[answers.indexOf(choice)];
				question = await this.nextQuestion(answer.href, question.url);
				if (question.win) {
					win = question.win;
					break;
				}
			}
			this.client.games.delete(msg.channel.id);
			if (win === 'time') return msg.say('Game ended due to forfeit.');
			return msg.say(stripIndents`
				**${question.win ? 'You won!' : '20Q won!'}**
				${question.result}
			`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async initialize() {
		const { text } = await request
			.get(`${baseURI}/gsq-en`)
			.set({ Referer: 'http://www.20q.net/' });
		const $ = cheerio.load(text);
		return $('form').first().attr('action');
	}

	async startGame(startURL) {
		const { text } = await request
			.post(`${baseURI}${startURL}`)
			.set({
				Origin: `${baseURI}/`,
				Referer: `${baseURI}/gsq-en`
			})
			.attach({
				submit: '  Play  ',
				age: '',
				cctkr: 'US,AR,VI,GB,AF,PL'
			});
		const $ = cheerio.load(text);
		const resultText = $('big').eq(2).children().first();
		const answers = [];
		$(resultText).find('a').each((i, elem) => {
			const href = `${baseURI}${$(elem).attr('href')}`;
			answers.push({ href, text: $(elem).text().trim() })
		});
		return {
			question: resultText.text().split('\n')[0],
			answers,
			url: `${baseURI}${startURL}`
		}
	}

	async nextQuestion(url, referer) {
		const { text } = await request
			.get(url)
			.set({ Referer: referer });
		const $ = cheerio.load(text);
		const win = $('h2').first().text();
		if (win === '20Q won!') {
			return {
				win: false,
				result: $('big').first().children().first().text()
			};
		}
		if (win === 'You won!') {
			return {
				win: true,
				result: 'I was unable to guess what you were thinking. Nice job!'
			};
		}
		const resultText = $('big').first().children().first();
		const answers = [];
		$(resultText).find('a').each((i, elem) => {
			const href = `${baseURI}${$(elem).attr('href')}`;
			answers.push({ href, text: $(elem).text().trim() })
		});
		return {
			question: resultText.text().split('\n')[0],
			answers,
			url: `${baseURI}${startURL}`
		}
	}
};
