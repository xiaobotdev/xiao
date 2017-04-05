const commando = require('discord.js-commando');
const Discord = require('discord.js');
const math = require('mathjs');

module.exports = class MathGameCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'mathgame',
            group: 'games',
            memberName: 'mathgame',
            description: 'See how fast you can answer a math problem in a given time limit. (;mathgame easy)',
            examples: [';mathgame easy', ';mathgame medium', ';mathgame hard', ';mathgame extreme'],
            args: [{
                key: 'difficulty',
                prompt: 'What difficulty should the math game be? easy, medium, hard, or extreme?',
                type: 'string',
                validate: difficulty => {
                    if (difficulty.toLowerCase() === 'easy' || difficulty.toLowerCase() === 'medium' || difficulty.toLowerCase() === 'hard' || difficulty.toLowerCase() === 'extreme') {
                        return true;
                    }
                    return 'Please set the difficulty to either `easy`, `medium`, `hard`, or `extreme`.';
                }
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        const level = args.difficulty.toLowerCase();
        let randomType = ['+', '-', '*'];
        randomType = randomType[Math.floor(Math.random() * randomType.length)];
        let randomValue;
        switch (level) {
            case 'easy':
                randomValue = 10;
                break;
            case 'medium':
                randomValue = 50;
                break;
            case 'hard':
                randomValue = 100;
                break;
            case 'extreme':
                randomValue = 1000;
                break;
        }
        const randomValue1 = Math.floor(Math.random() * randomValue) + 1;
        const randomValue2 = Math.floor(Math.random() * randomValue) + 1;
        const randomExpression = randomValue1 + randomType + randomValue2;
        const solved = math.eval(randomExpression);
        const embed = new Discord.RichEmbed()
            .setTitle('You have **ten** seconds to answer:')
            .setDescription(randomExpression);
        const embedMsg = await message.embed(embed);
        try {
            const collected = await message.channel.awaitMessages(response => response.author.id === message.author.id, {
                max: 1,
                time: 10000,
                errors: ['time']
            });
            if (collected.first().content !== solved.toString()) {
                const loseMsg = await message.say(`Aw... Too bad, try again next time!\nThe correct answer is: ${solved}`);
                return [embedMsg, loseMsg];
            }
            const victoryMsg = await message.say(`Good Job! You won! ${solved} is the correct answer!`);
            return [embedMsg, victoryMsg];
        }
        catch (err) {
            const loseMsg = await message.say(`Aw... Too bad, try again next time!\nThe correct answer is: ${solved}`);
            return [embedMsg, loseMsg];
        }
    }
};
