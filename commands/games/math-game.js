const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const math = require('mathjs');
const { list } = require('../../structures/Util');
const difficulties = ['easy', 'medium', 'hard', 'extreme', 'impossible'];
const operations = {
	easy: ['+', '-'],
	medium: ['+', '-'],
	hard: ['-', '*'],
	extreme: ['*', '/'],
	impossible: ['/', '^']
};
const maxValues = {
	easy: 5,
	medium: 10,
	hard: 50,
	extreme: 75,
	impossible: 100
};

module.exports = class MathGameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'math-game',
			group: 'games',
			memberName: 'math-game',
			description: 'See how fast you can answer a math problem in a given time limit.',
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
		const operation = operations[difficulty][Math.floor(Math.random() * operations[difficulty].length)];
		const value1 = Math.floor(Math.random() * maxValues[difficulty]) + 1;
		const value2 = Math.floor(Math.random() * maxValues[difficulty]) + 1;
		const expression = `${value1} ${operation} ${value2}`;
		const answer = math.eval(expression).toString();
		const embed = new MessageEmbed()
			.setTitle('You have 10 seconds to answer:')
			.setColor(0x9797FF)
			.setDescription(expression);
		await msg.embed(embed);
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time: 10000
		});
		if (!msgs.size) return msg.say(`Time! It was ${answer}, sorry!`);
		if (msgs.first().content !== answer) return msg.say(`Nope, sorry, it's ${answer}.`);
		return msg.say('Nice job! 10/10! You deserve some cake!');
	}
};
