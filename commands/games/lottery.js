const { Command } = require('discord.js-commando');

module.exports = class LotteryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lottery',
            group: 'games',
            memberName: 'lottery',
            description: '1 in 100 Chance of Winning. Winners get... The feeling of winning? (;lottery)',
            examples: [';lottery']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const lottery = ['Winner'][Math.floor(Math.random() * 100)];
        const userName = message.member ? message.member.displayName : message.author.username;
        if (lottery !== 'Winner') return message.say(`Nope, sorry ${userName}, you lost.`);
        return message.say(`Wow ${userName}! You actually won! Great job!`);
    }
};
