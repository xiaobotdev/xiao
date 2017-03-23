const commando = require('discord.js-commando');
const Discord = require('discord.js');
const math = require('mathjs');

module.exports = class MathGameCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'mathgame',
            group: 'random',
            memberName: 'mathgame',
            description: 'See how fast you can answer a math problem in a given time limit. (;mathgame easy)',
            examples: [';mathgame easy', ';mathgame medium', ';mathgame hard', ';mathgame extreme']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log("[Command] " + message.content);
        let [level] = message.content.toLowerCase().split(" ").slice(1);
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
        if (!randomValue) {
            message.channel.send(':x: Error! No difficulty set! (Choose Easy, Medium, Hard, or Extreme)');
        }
        else {
            const embed = new Discord.RichEmbed()
                .setTitle('You have **ten** seconds to answer:')
                .setDescription(randomExpression);
            message.channel.sendEmbed(embed).then(() => {
                message.channel.awaitMessages(response => response.content === solved.toString() && response.author.id === message.author.id, {
                    max: 1,
                    time: 10000,
                    errors: ['time'],
                }).then((collected) => {
                    message.channel.send(`Good Job! You won!`);
                }).catch(() => {
                    message.channel.send('Aw... Too bad, try again next time! The correct answer was: ' + solved);
                });
            });
        }
    }
};
