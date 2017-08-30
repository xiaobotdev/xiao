const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { list } = require('../../structures/Util');
const difficulties = ['easy', 'medium', 'hard', 'extreme', 'impossible'];
const operations = ['addition', 'subtraction', 'multiplication', 'division'];
const operationDisplay = {
	addition: '+',
	subtraction: '-',
	multiplication: '*',
	division: '÷'
};
const maxValues = {
	easy: 10,
	medium: 100,
	hard: 500,
	extreme: 1000,
	impossible: 1000000
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
					key: 'operation',
					prompt: `Which operation should be used for the game? Either ${list(operations, 'or')}.`,
					type: 'string',
					validate: operation => {
						if (operations.includes(operation.toLowerCase())) return true;
						return `Invalid operation, please enter either ${list(operations, 'or')}.`;
					},
					parse: operation => operation.toLowerCase()
				},
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
		const { operation, difficulty } = args;
		const value1 = Math.floor(Math.random() * maxValues[difficulty]) + 1;
		const value2 = Math.floor(Math.random() * maxValues[difficulty]) + 1;
		let answer;
		if (operation === 'addition') answer = value1 + value2;
		else if (operation === 'subtraction') answer = value1 - value2;
		else if (operation === 'multiplication') answer = value1 * value2;
		else if (operation === 'division') answer = value1 / value2;
		const embed = new MessageEmbed()
			.setTitle('You have 10 seconds to answer:')
			.setColor(0x9797FF)
			.setDescription(`${value1} ${operationDisplay[operation]} ${value2}`);
		await msg.embed(embed);
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time: 10000
		});
		if (!msgs.size) return msg.say(`Time! It was ${answer}, sorry!`);
		if (msgs.first().content !== answer.toString()) return msg.say(`Nope, sorry, it's ${answer}.`);
		return msg.say('Nice job! 10/10! You deserve some cake!');
	}
};
