const commando = require('discord.js-commando');
const Discord = require('discord.js');
const math = require('mathjs');

module.exports = class MathGameCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'games',
            group: 'random',
            memberName: 'mathgame',
            description: 'See how fast you can answer a math problem in a given time limit. (;mathgame easy)',
            examples: [';mathgame easy', ';mathgame medium', ';mathgame hard', ';mathgame extreme'],
            args: [{
                key: 'difficulty',
                prompt: 'What difficulty should the math game be? Easy, Medium, Hard, or Extreme?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let level = args.difficulty.toLowerCase();
        if (level !== 'easy' || level !== 'medium' || level !== 'hard' || level !== 'extreme') return message.channel.send(':x: Error! Please set the difficulty to either easy, medium, hard, or extreme!');
        let randomType = ['+', '-', '*'];
        randomType = randomType[Math.floor(Math.random() * randomType.length)];
        let randomValue;
        switch (level) {
            case "easy":
                randomValue = 10;
                break;
            case "medium":
                randomValue = 50;
                break;
            case "hard":
                randomValue = 100;
                break;
            case "extreme":
                randomValue = 1000;
                break;
        }
        let randomValue1 = Math.floor(Math.random() * randomValue) + 1;
        let randomValue2 = Math.floor(Math.random() * randomValue) + 1;
        let randomExpression = randomValue1 + randomType + randomValue2;
        let solved = math.eval(randomExpression);
        const embed = new Discord.RichEmbed()
            .setTitle('You have **ten** seconds to answer:')
            .setDescription(randomExpression);
        let embedMsg = await message.channel.sendEmbed(embed);
        try {
            let collected = await message.channel.awaitMessages(response => response.content === solved.toString() && response.author.id === message.author.id, {
                max: 1,
                time: 10000,
                errors: ['time'],
            });
            let victoryMsg = await message.channel.send(`Good Job! You won! ${solved} is the correct answer!`);
            return [embedMsg, collected, victoryMsg];
        }
        catch (err) {
            let loseMsg = await message.channel.send(`Aw... Too bad, try again next time!\nThe correct answer is: ${solved}`);
            return [embedMsg, loseMsg];
        }
    }
};
