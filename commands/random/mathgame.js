const commando = require('discord.js-commando');
const Discord = require('discord.js');
const math = require('mathjs');

class MathGameCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'mathgame', 
            group: 'random',
            memberName: 'mathgame',
            description: 'See how fast you can answer a math problem in a given time limit. (;typinggame easy)',
            examples: [';typinggame easy', ';typinggame medium', ';typinggame hard', ';typinggame extreme']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
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
            randomValue = 100;
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
        let time;
        switch (level) {
            case "easy":
            time = 15000;
            break;
            case "medium":
            time = 10000;
            break;
            case "hard":
            time = 5000;
            break;
            case "extreme": 
            time = 3000;
            break;
        }
        let levelWord;
        switch (level) {
            case "easy":
            levelWord = "fifteen";
            break;
            case "medium":
            levelWord = "ten";
            break;
            case "hard":
            levelWord = "five";
            break;
            case "extreme": 
            levelWord = "three";
            break;
        }
        let randomExpression = randomValue1 + randomType + randomValue2;
        let solved = math.eval(randomExpression);
        if(time === undefined) {
            message.channel.sendMessage(':x: Error! No difficulty set! (Choose Easy, Medium, Hard, or Extreme)');
        } else {
            const embed = new Discord.RichEmbed()
            .setTitle('You have **' + levelWord + '** seconds to answer:')
            .setDescription(randomExpression);
            message.channel.sendEmbed(embed).then(() => {
                message.channel.awaitMessages(response => response.content === solved.toString() && response.author.id === message.author.id, {
                    max: 1,
                    time: time,
                    errors: ['time'],
                }).then((collected) => {
                    message.channel.sendMessage(`Good Job! You won!`);
                }).catch(() => {
                    message.channel.sendMessage('Aw... Too bad, try again next time! The correct answer was: ' + solved);
                });
            });
        }
    }
}

module.exports = MathGameCommand;