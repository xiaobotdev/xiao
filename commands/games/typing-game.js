const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { list } = require('../../structures/Util');
const difficulties = ['easy', 'medium', 'hard', 'extreme', 'impossible'];
const times = {
	easy: 25000,
	medium: 20000,
	hard: 15000,
	extreme: 10000,
	impossible: 5000
};
const sentences = require('../../assets/json/typing-game');

module.exports = class TypingGameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'typing-game',
			group: 'games',
			memberName: 'typing-game',
			description: 'See how fast you can type a sentence in a given time limit.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'difficulty',
					prompt: `What should the difficulty of the game be? Either ${list(difficulties, 'or')}.`,
					type: 'string',
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
		const { difficulty } = args;
		const sentence = sentences[Math.floor(Math.random() * sentences.length)];
		const time = times[difficulty];
		await msg.say(stripIndents`
			**You have ${time / 1000} seconds to type this sentence.**
			${sentence}
		`);
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time
		});
		if (!msgs.size || msgs.first().content !== sentence) return msg.say('Sorry! You lose!');
		return msg.say('Nice job! 10/10! You deserve some cake!');
	}
};
