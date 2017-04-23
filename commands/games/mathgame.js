const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const math = require('mathjs');
const operations = ['+', '-', '*'];

module.exports = class MathGameCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mathgame',
            group: 'games',
            memberName: 'mathgame',
            description: 'See how fast you can answer a math problem in a given time limit.',
            args: [{
                key: 'difficulty',
                prompt: 'What difficulty should the math game be? easy, medium, hard, or extreme?',
                type: 'string',
                validate: difficulty => {
                    if (difficulty.toLowerCase() === 'easy' || difficulty.toLowerCase() === 'medium' || difficulty.toLowerCase() === 'hard' || difficulty.toLowerCase() === 'extreme') {
                        return true;
                    }
                    return 'Please set the difficulty to either `easy`, `medium`, `hard`, or `extreme`.';
                },
                parse: text => text.toLowerCase()
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        const { difficulty } = args;
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let value;
        switch (difficulty) {
            case 'easy':
                value = 10;
                break;
            case 'medium':
                value = 50;
                break;
            case 'hard':
                value = 100;
                break;
            case 'extreme':
                value = 1000;
                break;
        }
        const value1 = Math.floor(Math.random() * value) + 1;
        const value2 = Math.floor(Math.random() * value) + 1;
        const expression = `${value1} ${operation} ${value2}`;
        const solved = math.eval(expression);
        const embed = new RichEmbed()
            .setTitle('You have **ten** seconds to answer:')
            .setDescription(expression);
        await message.embed(embed);
        try {
            const collected = await message.channel.awaitMessages(response => response.author.id === message.author.id, {
                max: 1,
                time: 10000,
                errors: ['time']
            });
            if (collected.first().content !== solved.toString()) {
                return message.say(`Aw... Too bad, try again next time!\nThe correct answer is: ${solved}`);
            }
            return message.say(`Good Job! You won! ${solved} is the correct answer!`);
        } catch (err) {
            return message.say(`Aw... Too bad, try again next time!\nThe correct answer is: ${solved}`);
        }
    }
};
