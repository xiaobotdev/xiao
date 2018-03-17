const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const { list } = require('../../util/Util');
const difficulties = ['easy', 'medium', 'hard', 'extreme', 'impossible'];
const operations = ['+', '-', '*'];
const maxValues = {
	easy: 10,
	medium: 100,
	hard: 500,
	extreme: 1000,
	impossible: 1000000
};

module.exports = class MathQuizCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'math-quiz',
			aliases: ['math-game'],
			group: 'games',
			memberName: 'math-quiz',
			description: 'See how fast you can answer a math problem in a given time limit.',
			details: `**Difficulties**: ${difficulties.join(', ')}`,
			args: [
				{
					key: 'difficulty',
					prompt: `What should the difficulty of the game be? Either ${list(difficulties, 'or')}.`,
					type: 'choice',
					choices: difficulties
				}
			]
		});
	}

	async run(msg, { difficulty }) {
		const value1 = Math.floor(Math.random() * maxValues[difficulty]) + 1;
		const value2 = Math.floor(Math.random() * maxValues[difficulty]) + 1;
		const operation = operations[Math.floor(Math.random() * operations.length)];
		let answer;
		switch (operation) {
			case '+': answer = value1 + value2; break;
			case '-': answer = value1 - value2; break;
			case '*': answer = value1 * value2; break;
		}
		await msg.say(stripIndents`
			**You have 10 seconds to answer this question.**
			${value1} ${operation} ${value2}
		`);
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time: 10000
		});
		if (!msgs.size) return msg.say(`Sorry, time is up! It was ${answer}.`);
		if (msgs.first().content !== answer.toString()) return msg.say(`Nope, sorry, it's ${answer}.`);
		return msg.say('Nice job! 10/10! You deserve some cake!');
	}
};
