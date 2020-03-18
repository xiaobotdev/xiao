const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { list } = require('../../util/Util');
const sentences = require('../../assets/json/typing-test');
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
		const sentence = sentences[Math.floor(Math.random() * sentences.length)];
		const time = times[difficulty];
		await msg.reply(stripIndents`
			**You have ${time / 1000} seconds to type this sentence.**
			${sentence}
		`);
		const now = Date.now();
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time
		});
		if (!msgs.size) return msg.reply('Sorry! You lose!');
		if (msgs.first().content !== sentence) return msg.reply('Sorry! You made a typo, so you lose!');
		return msg.reply(`Nice job! 10/10! You deserve some cake! (Took ${(Date.now() - now) / 1000} seconds)`);
	}
};
