const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const difficulties = ['baby', 'easy', 'medium', 'hard', 'extreme', 'impossible'];
const operations = ['+', '-', '*'];
const maxValues = {
	baby: 10,
	easy: 50,
	medium: 100,
	hard: 500,
	extreme: 1000,
	impossible: Number.MAX_SAFE_INTEGER
};
const maxMultiplyValues = {
	baby: 5,
	easy: 12,
	medium: 30,
	hard: 50,
	extreme: 100,
	impossible: Number.MAX_SAFE_INTEGER
};

module.exports = class MathQuizCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'math-quiz',
			group: 'games-sp',
			memberName: 'math-quiz',
			description: 'See how fast you can answer a math problem in a given time limit.',
			details: `**Difficulties:** ${difficulties.join(', ')}`,
			args: [
				{
					key: 'difficulty',
					type: 'string',
					oneOf: difficulties,
					parse: difficulty => difficulty.toLowerCase()
				}
			]
		});
	}

	async run(msg, { difficulty }) {
		const operation = operations[Math.floor(Math.random() * operations.length)];
		let answer;
		let value1;
		let value2;
		switch (operation) {
			case '+':
				value1 = Math.floor(Math.random() * maxValues[difficulty]) + 1;
				value2 = Math.floor(Math.random() * maxValues[difficulty]) + 1;
				answer = value1 + value2;
				break;
			case '-':
				value1 = Math.floor(Math.random() * maxValues[difficulty]) + 1;
				value2 = Math.floor(Math.random() * maxValues[difficulty]) + 1;
				answer = value1 - value2;
				break;
			case '*':
				value1 = Math.floor(Math.random() * maxMultiplyValues[difficulty]) + 1;
				value2 = Math.floor(Math.random() * maxMultiplyValues[difficulty]) + 1;
				answer = value1 * value2;
				break;
		}
		await msg.reply(stripIndents`
			**You have 10 seconds to answer this question.**
			${value1} ${operation} ${value2}
		`);
		const msgs = await msg.channel.awaitMessages({
			filter: res => res.author.id === msg.author.id,
			max: 1,
			time: 10000
		});
		if (!msgs.size) return msg.reply(`Sorry, time is up! It was ${answer}.`);
		if (msgs.first().content !== answer.toString()) return msg.reply(`Nope, sorry, it's ${answer}.`);
		return msg.reply('Nice job! 10/10! You deserve some cake!');
	}
};
