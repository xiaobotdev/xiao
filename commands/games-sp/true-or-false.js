const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const request = require('node-superfetch');
const { list } = require('../../util/Util');
const difficulties = ['easy', 'medium', 'hard'];
const trueAns = ['true', 't', 'tru', 'yes', 'y'];
const falseAns = ['false', 'f', 'no', 'n'];

module.exports = class TrueOrFalseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'true-or-false',
			aliases: ['true-false', 'tf', 'quiz-boolean'],
			group: 'games-sp',
			memberName: 'true-or-false',
			description: 'Answer a true or false question.',
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
					prompt: `What should the difficulty of the game be? Either ${list(difficulties, 'or')}.`,
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
					type: 'boolean',
					encode: 'url3986',
					difficulty
				});
			if (!body.results) return msg.reply('Oh no, a question could not be fetched. Try again later!');
			const correct = decodeURIComponent(body.results[0].correct_answer.toLowerCase());
			const correctBool = correct === 'true';
			await msg.reply(stripIndents`
				**You have 15 seconds to answer this question.**
				${decodeURIComponent(body.results[0].question)}
				**[T]rue or [F]alse?**
			`);
			const filter = res => {
				if (res.author.id !== msg.author.id) return false;
				return trueAns.includes(res.content.toLowerCase()) || falseAns.includes(res.content.toLowerCase());
			};
			const msgs = await msg.channel.awaitMessages(filter, {
				max: 1,
				time: 15000
			});
			if (!msgs.size) return msg.reply(`Sorry, time is up! It was ${correctBool}.`);
			const ans = msgs.first().content.toLowerCase();
			const ansBool = trueAns.includes(ans);
			if (correctBool !== ansBool) return msg.reply(`Nope, sorry, it's ${correctBool}.`);
			return msg.reply('Nice job! 10/10! You deserve some cake!');
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
