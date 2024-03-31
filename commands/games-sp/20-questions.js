const Command = require('../../framework/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { stripIndents } = require('common-tags');
const { list } = require('../../util/Util');
const games = require('../../assets/json/20-questions');

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
			],
			args: [
				{
					key: 'game',
					prompt: `What game do you want to play? Either ${list(Object.keys(games), 'or')}.`,
					type: 'string',
					oneOf: Object.keys(games),
					parse: game => games[game.toLowerCase()]
				}
			]
		});
	}

	async run(msg, { game }) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		try {
			const startURL = await this.initialize(game);
			let question = await this.startGame(game, startURL);
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
				const msgs = await msg.channel.awaitMessages({
					filter,
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
				question = await this.nextQuestion(game, answer.href, question.url);
				if (typeof question.win !== 'undefined') {
					win = question.win;
					break;
				}
			}
			this.client.games.delete(msg.channel.id);
			if (win === 'time') return msg.say('Game ended due to forfeit.');
			return msg.say(stripIndents`
				**${question.winText}**
				${question.result}
			`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	makeBaseURI(game) {
		if (!game) return 'http://y.20q.net';
		return `http://${game}.20q.net`;
	}

	async initialize(game) {
		const { text } = await request
			.get(`${this.makeBaseURI(game)}/gs${game ? 'e' : 'q-en'}`)
			.set({ Referer: 'http://www.20q.net/' });
		const $ = cheerio.load(text);
		return $('form').first().attr('action');
	}

	async startGame(game, startURL) {
		const data = new URLSearchParams();
		data.append('submit', '  Play  ');
		data.append('age', '');
		data.append('cctkr', 'US,AR,VI,GB,AF,PL');
		const { text } = await request
			.post(`${this.makeBaseURI(game)}${startURL}`)
			.set({
				Origin: `${this.makeBaseURI(game)}/`,
				Referer: `${this.makeBaseURI(game)}/gs${game ? 'e' : 'q-en'}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			})
			.send(data, true);
		const $ = cheerio.load(text);
		const i = game === 'starwars' || game === 'marvel' ? 5 : 2;
		const resultText = $('big').eq(i).children().first();
		const answers = [];
		$(resultText).find('a').each((j, elem) => {
			const href = `${this.makeBaseURI(game)}${$(elem).attr('href')}`;
			answers.push({ href, text: $(elem).text().trim() });
		});
		return {
			question: resultText.text().split('\n')[0],
			answers,
			url: `${this.makeBaseURI(game)}${startURL}`
		};
	}

	async nextQuestion(game, url, referer) {
		const { text } = await request
			.get(url)
			.set({ Referer: referer });
		const $ = cheerio.load(text);
		const win = $('h2').first().text();
		if (win === '20Q won!') {
			return {
				win: false,
				winText: win,
				result: $('big').first().children().first().text()
			};
		}
		if (win === 'You won!') {
			return {
				win: true,
				winText: win,
				result: 'I was unable to guess what you were thinking. Nice job!'
			};
		}
		if (win === 'You won, but 20Q guessed it eventually') {
			return {
				win: true,
				winText: win,
				result: $('big').first().children().first().text()
			};
		}
		const resultText = $('big').first().children().first();
		const answers = [];
		$(resultText).find('a').each((i, elem) => {
			const href = `${this.makeBaseURI(game)}${$(elem).attr('href')}`;
			answers.push({ href, text: $(elem).text().trim() });
		});
		return {
			question: resultText.text().split('\n')[0],
			answers,
			url
		};
	}
};
