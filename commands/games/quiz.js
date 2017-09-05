const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const snekfetch = require('snekfetch');
const { shuffle, list } = require('../../structures/Util');
const types = ['multiple', 'boolean'];
const difficulties = ['easy', 'medium', 'hard'];

module.exports = class QuizCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'quiz',
			aliases: ['jeopardy'],
			group: 'games',
			memberName: 'quiz',
			description: 'Answer a quiz question.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'type',
					prompt: `Which type of question would you like to have? Either ${list(types, 'or')}.`,
					type: 'string',
					validate: type => {
						if (types.includes(type.toLowerCase())) return true;
						return `Invalid type, please enter either ${list(types, 'or')}.`;
					},
					parse: type => type.toLowerCase()
				},
				{
					key: 'difficulty',
					prompt: `What should the difficulty of the game be? Either ${list(difficulties, 'or')}.`,
					type: 'string',
					default: '',
					validate: difficulty => {
						if (difficulties.includes(difficulty.toLowerCase())) return true;
						return `Invalid difficulty, please enter either ${list(difficulties, 'or')}.`;
					},
					parse: difficulty => difficulty.toLowerCase()
				}
			]
		});
	}

	async run(msg, args) {
		const { type, difficulty } = args;
		try {
			const { body } = await snekfetch
				.get('https://opentdb.com/api.php')
				.query({
					amount: 1,
					type,
					encode: 'url3986',
					difficulty
				});
			if (!body.results) return msg.say('Oh no, a question could not be fetched. Try again later!');
			const answers = body.results[0].incorrect_answers.map(answer => decodeURIComponent(answer.toLowerCase()));
			const correct = decodeURIComponent(body.results[0].correct_answer.toLowerCase());
			answers.push(correct);
			await msg.say(stripIndents`
				**You have 15 seconds to answer this question.**
				_${decodeURIComponent(body.results[0].category)}:_ ${decodeURIComponent(body.results[0].question)}
				${type === 'boolean' ? 'True or False?' : ''}${type === 'multiple' ? `${list(shuffle(answers), 'or')}?` : ''}
			`);
			const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
				max: 1,
				time: 15000
			});
			if (!msgs.size) return msg.say(`Time! It was ${correct}, sorry!`);
			if (msgs.first().content.toLowerCase() !== correct) return msg.say(`Nope, sorry, it's ${correct}.`);
			return msg.say('Nice job! 10/10! You deserve some cake!');
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
