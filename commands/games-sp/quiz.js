const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const request = require('node-superfetch');
const { shuffle } = require('../../util/Util');
const difficulties = ['easy', 'medium', 'hard'];
const choices = ['A', 'B', 'C', 'D'];

module.exports = class QuizCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'quiz',
			aliases: ['trivia'],
			group: 'games-sp',
			memberName: 'quiz',
			description: 'Answer a quiz question.',
			details: `**Difficulties:** ${difficulties.join(', ')}`,
			credit: [
				{
					name: 'Open Trivia DB',
					url: 'https://opentdb.com/',
					reason: 'API',
					reasonURL: 'https://opentdb.com/api_config.php'
				}
			],
			args: [
				{
					key: 'difficulty',
					type: 'string',
					default: '',
					oneOf: difficulties,
					parse: difficulty => difficulty.toLowerCase()
				}
			]
		});
	}

	async run(msg, { difficulty }) {
		try {
			const { body } = await request
				.get('https://opentdb.com/api.php')
				.query({
					amount: 1,
					type: 'multiple',
					encode: 'url3986',
					difficulty
				});
			if (!body.results) return msg.reply('Oh no, a question could not be fetched. Try again later!');
			const answers = body.results[0].incorrect_answers.map(answer => decodeURIComponent(answer.toLowerCase()));
			const correct = decodeURIComponent(body.results[0].correct_answer.toLowerCase());
			answers.push(correct);
			const shuffled = shuffle(answers);
			await msg.reply(stripIndents`
				**You have 15 seconds. The category is _${decodeURIComponent(body.results[0].category)}_.**
				${decodeURIComponent(body.results[0].question)}
				${shuffled.map((answer, i) => `**${choices[i]}.** ${answer}`).join('\n')}
			`);
			const filter = res => res.author.id === msg.author.id && choices.includes(res.content.toUpperCase());
			const msgs = await msg.channel.awaitMessages({
				filter,
				max: 1,
				time: 15000
			});
			if (!msgs.size) return msg.reply(`Sorry, time is up! It was ${correct}.`);
			const win = shuffled[choices.indexOf(msgs.first().content.toUpperCase())] === correct;
			if (!win) return msg.reply(`Nope, sorry, it's ${correct}.`);
			return msg.reply('Nice job! 10/10! You deserve some cake!');
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
