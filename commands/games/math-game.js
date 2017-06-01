const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const math = require('mathjs');
const { operations, difficulties, maxValues } = require('../../assets/json/math-game');

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
                    prompt: `What should the difficulty of the game be? One of: ${difficulties.join(', ')}`,
                    type: 'string',
                    validate: (difficulty) => {
                        if (difficulties.includes(difficulty.toLowerCase())) return true;
                        else return `The difficulty must be one of: ${difficulties.join(', ')}`;
                    },
                    parse: (difficulty) => difficulty.toLowerCase()
                }
            ]
        });
    }

    async run(msg, args) {
        const { difficulty } = args;
        const operation = operations[Math.floor(Math.random() * operations.length)];
        const maxValue = maxValues[difficulty];
        const value1 = Math.floor(Math.random() * maxValue) + 1;
        const value2 = Math.floor(Math.random() * maxValue) + 1;
        const expression = `${value1} ${operation} ${value2}`;
        const answer = math.eval(expression).toString();
        const embed = new RichEmbed()
            .setTitle('You have 10 seconds to answer:')
            .setDescription(expression);
        await msg.embed(embed);
        try {
            const collected = await msg.channel.awaitMessages((res) => res.author.id === msg.author.id, {
                max: 1,
                time: 10000,
                errors: ['time']
            });
            if (collected.first().content !== answer) return msg.say(`Nope, sorry, it's ${answer}.`);
            else return msg.say('Nice job! 10/10! You deserve some cake!');
        } catch (err) {
            return msg.say(`Time! It was ${answer}, sorry!`);
        }
    }
};
