const Command = require('../../framework/Command');
const { MessageButton, MessageActionRow } = require('discord.js');
const request = require('node-superfetch');
const cheerio = require('cheerio');
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
					default: '',
					oneOf: Object.keys(games),
					parse: game => games[game.toLowerCase()]
				}
			]
		});
	}

	async run(msg, { game }) {
		const startURL = await this.initialize(game);
		let question = await this.startGame(game, startURL);
		let win = null;
		const initialRow = new MessageActionRow().addComponents(
			new MessageButton().setCustomId('true').setLabel('Ready!').setStyle('PRIMARY'),
			new MessageButton().setCustomId('false').setLabel('Nevermind').setStyle('SECONDARY')
		);
		const gameMsg = await msg.reply({
			content: 'Welcome to 20 Questions! Think of something, and I will try to guess it.',
			components: [initialRow]
		});
		let buttonPress;
		try {
			buttonPress = await gameMsg.awaitMessageComponent({
				filter: res => res.user.id === msg.author.id,
				max: 1,
				time: 30000
			});
			if (buttonPress.customId === 'false') return buttonPress.update({ content: 'Too bad...', components: [] });
		} catch {
			return gameMsg.edit({ content: 'Guess you didn\'t want to play after all...', components: [] });
		}
		await this.sendLoadingMessage(buttonPress, [initialRow]);
		while (win === null) {
			const answers = question.answers.map(answer => answer.text);
			const rowCount = Math.ceil(answers.length / 5);
			const rows = [];
			for (let i = 0; i <= rowCount; i++) rows.push(new MessageActionRow());
			let rowi = 0;
			for (let i = 0; i < answers.length; i++) {
				const answer = answers[i];
				if (rows[rowi].components.length > 5) rowi++;
				const row = rows[rowi];
				row.addComponents(new MessageButton().setCustomId(answer).setStyle('PRIMARY').setLabel(answer));
			}
			const sRow = new MessageActionRow();
			sRow.addComponents(new MessageButton().setCustomId('end').setStyle('DANGER').setLabel('End'));
			await buttonPress.editReply({
				content: question.question,
				components: [...rows, sRow]
			});
			try {
				buttonPress = await gameMsg.awaitMessageComponent({
					filter: res => res.user.id === msg.author.id,
					max: 1,
					time: 30000
				});
			} catch {
				win = 'time';
				break;
			}
			await this.sendLoadingMessage(buttonPress, [...rows, sRow]);
			const choice = buttonPress.customId;
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
		if (win === 'time') return buttonPress.editReply({ content: 'Game ended due to forfeit.' });
		return buttonPress.editReply({ content: `**${question.winText}**\n${question.result}` });
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

	sendLoadingMessage(buttonPress, rows) {
		for (const row of rows) {
			for (const button of row.components) {
				button.setDisabled(true);
			}
		}
		return buttonPress.update({ content: 'Loading...', components: rows });
	}
};
