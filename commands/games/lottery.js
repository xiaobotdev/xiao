const { Command } = require('discord.js-commando');

module.exports = class LotteryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lottery',
            group: 'games',
            memberName: 'lottery',
            description: '1 in 100 chance of winning. Winners get... The feeling of winning?'
        });
    }

    run(message) {
        const lottery = Math.floor(Math.random() * 100) + 1;
        if (lottery < 99)
            return message.say(`Nope, sorry ${message.author.username}, you lost.`);
        return message.say(`Wow ${message.author.username}! You actually won! Great job!`);
    }
};
